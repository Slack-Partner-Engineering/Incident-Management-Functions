//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { incidentHandler } from "../../../utils/blockActionHandlers/incident-buttons-handler.ts";
import { saveNewIncident } from "../../../utils/database/create-incident.ts";
import { createJiraIssue } from "../../../utils/externalAPIs/atlassian/createJiraIssue.ts";
import { postReply } from "../../../utils/slack_apis/post-message.ts";
import { closeIncidentBlocks } from "../../../views/close-incident-blocks.ts";
import { addJiraComment } from "../../../utils/externalAPIs/atlassian/addJiraComment.ts";
import { updateJiraPriorityToLow } from "../../../utils/externalAPIs/atlassian/updateJiraPriority.ts";
import { jiraIssueBlocks } from "../../../views/jira-issue-blocks.ts";
import { getIncident } from "../../../utils/database/get-incident.ts";
import { updateIncident } from "../../../utils/database/update-incident.ts";
import { updateMessage } from "../../../utils/slack_apis/update-message.ts";
import { endCall } from "../../../utils/slack_apis/end-call.ts";
import { documentOnIncidentClose } from "../../../views/doc-on-incident-close.ts";
import { addBookmark } from "../../../utils/slack_apis/add-bookmark.ts";
import { setTopic } from "../../../utils/slack_apis/set-topic.ts";
import { driUpdatedBlocks } from "../../../views/dri-updated-blocks.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../../views/swarm-incident-original-message-update.ts";
import { swarmIncident } from "../../../views/swarm-incident.ts";
import { closeSalesforceIncident } from "../../../salesforce/close-salesforce-incident.ts";
import { createSalesforceIncident } from "../../../salesforce/create-salesforce-incident.ts";
import { getSalesforceIncidentBlocks } from "../../../views/salesforce-new-incident-created.ts";
import { removeBookmark } from "../../../utils/slack_apis/remove-bookmark.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    const incidentChannel = env["INCIDENT_CHANNEL"];
    const incident = <Incident> inputs;
    incident.short_description = incident.short_description.substring(0, 50);
    const createIssueResp = await createJiraIssue(env, incident);
    incident.incident_jira_issue_key = createIssueResp.key;
    incident.incident_status = "OPEN";
    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    const blocks = await newIncident(incident);

    const postMsgResp = await postMessage(
      token,
      incidentChannel,
      blocks,
    );

    incident.incident_channel_msg_ts = await postMsgResp.ts;

    const jiraIssueMessage = await jiraIssueBlocks(env, createIssueResp);

    await postReply(
      token,
      incidentChannel,
      jiraIssueMessage,
      postMsgResp.ts,
    );

    const sfIncident = <any> await createSalesforceIncident(
      incident,
      env,
      token,
    );
    console.log("SF incident id " + sfIncident.incidentId);

    incident.salesforce_incident_id = sfIncident.incidentId;

    const sfIncidentBlocks = await getSalesforceIncidentBlocks(
      sfIncident.incidentURL,
    );

    await postReply(
      token,
      incidentChannel,
      sfIncidentBlocks,
      postMsgResp.ts,
    );
    await updateIncident(token, incident);

    return {
      completed: false,
    };
  };

export default postIncident;

export const blockActions = incidentHandler;

export const viewSubmission = async (
  { view, body, token, env }: any,
) => {
  if (view.callback_id === "close_incident_modal") {
    const incidentClosedTS = Date.now();

    // save the currentTime so that we know what time the incident was closed
    const incidentID = await JSON.parse(view.private_metadata).incident_id;
    const incident = await getIncident(token, incidentID);
    const comment =
      view.state.values.add_comment_block.close_incident_action.value;

    incident.incident_status = "CLOSED";
    incident.incident_close_notes = comment;
    incident.incident_closed_ts = incidentClosedTS;
    const incidentJiraKey = incident.incident_jira_issue_key;
    await closeSalesforceIncident(incident, env, token);

    await addJiraComment(
      env,
      incidentJiraKey,
      comment,
    );

    await updateJiraPriorityToLow(env, incidentJiraKey);
    await updateIncident(token, incident);

    const closeBlocks = await closeIncidentBlocks(incident);

    await updateMessage(
      token,
      incident.incident_channel,
      incident.incident_channel_msg_ts,
      closeBlocks,
    );

    const curIncident = await getIncident(token, <string> incident.incident_id);

    if (
      incident.incident_swarming_channel_id !== undefined &&
      incident.incident_swarming_msg_ts !== undefined
    ) {
      await endCall(curIncident.incident_call_id, token);
      await removeBookmark(
        token,
        curIncident.incident_swarming_channel_id,
        curIncident.zoom_call_bookmark_id,
      );

      await updateMessage(
        token,
        incident.incident_swarming_channel_id,
        incident.incident_swarming_msg_ts,
        closeBlocks,
      );

      await setTopic(
        token,
        incident.incident_swarming_channel_id,
        `CLOSED ${incident.long_description?.substring(0, 250)}`,
      );

      await addBookmark(
        token,
        incident.incident_swarming_channel_id,
        "RCA Template",
        "link",
        `https://slack1.box.com/s/r783r9wafmts2ala656l82ol50vo8h2s`,
        ":boxcorp:",
      );

      const incidentCloseDocumentBlocks = documentOnIncidentClose();
      await postMessage(
        token,
        incident.incident_swarming_channel_id,
        incidentCloseDocumentBlocks,
      );
    }
  }
  if (view.callback_id === "assign_dri_modal") {
    const incidentID = await JSON.parse(view.private_metadata).incident_id;
    const incident = await getIncident(token, incidentID);
    const dri =
      view.state.values.assign_dri_block.users_select_action.selected_users[0];
    incident.incident_dri = dri;
    await updateIncident(token, incident);
    const driBlocks = await driUpdatedBlocks(dri);

    if (incident.incident_swarming_channel_id !== undefined) {
      const updatedIncidentBlocks = await swarmIncident(incident);
      await updateMessage(
        token,
        incident.incident_swarming_channel_id,
        incident.incident_swarming_msg_ts,
        updatedIncidentBlocks,
      );

      const updatedIncidentChannelBlocks =
        await swarmIncidentOriginalMessageUpdate(
          incident,
        );
      await updateMessage(
        token,
        incident.incident_channel,
        incident.incident_channel_msg_ts,
        updatedIncidentChannelBlocks,
      );

      await postMessage(
        token,
        incident.incident_swarming_channel_id,
        driBlocks,
      );
    } else {
      const blocks = await newIncident(incident);
      await updateMessage(
        token,
        incident.incident_channel,
        incident.incident_channel_msg_ts,
        blocks,
      );
      await postReply(
        token,
        incident.incident_channel,
        driBlocks,
        incident.incident_channel_msg_ts,
      );
    }
  }
};

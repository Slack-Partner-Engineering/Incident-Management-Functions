import { closeSalesforceIncident } from "../../salesforce/close-salesforce-incident.ts";
import { closeIncidentBlocks } from "../../views/close-incident-blocks.ts";
import { documentOnIncidentClose } from "../../views/doc-on-incident-close.ts";
import { getIncident } from "../database/get-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { addJiraComment } from "../externalAPIs/atlassian/addJiraComment.ts";
import { updateJiraPriorityToLow } from "../externalAPIs/atlassian/updateJiraPriority.ts";
import { sendMessageClerk } from "../externalAPIs/clerk/message-logic.ts";
import { addBookmark } from "../slack_apis/add-bookmark.ts";
import { endCall } from "../slack_apis/end-call.ts";
import { postMessage } from "../slack_apis/post-message.ts";
import { removeBookmark } from "../slack_apis/remove-bookmark.ts";
import { setTopic } from "../slack_apis/set-topic.ts";
import { updateMessage } from "../slack_apis/update-message.ts";

const closeIncidentModalCallback = async (
  view: any,
  token: string,
  env: any,
) => {
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
  await sendMessageClerk(incident, env, "close");

  await addJiraComment(
    env,
    incidentJiraKey,
    comment,
  );

  await updateJiraPriorityToLow(env, incidentJiraKey);

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

    const rca_bookmark = await addBookmark(
      token,
      incident.incident_swarming_channel_id,
      "RCA Template",
      "link",
      `https://slack1.box.com/s/r783r9wafmts2ala656l82ol50vo8h2s`,
      ":boxcorp:",
    );
    if (rca_bookmark != undefined) {
      incident.rca_doc_bookmark_id = rca_bookmark.bookmark.id;
    }
    await updateIncident(token, incident);

    const incidentCloseDocumentBlocks = documentOnIncidentClose();
    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      incidentCloseDocumentBlocks,
    );
  }
};

export { closeIncidentModalCallback };

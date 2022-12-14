//This function posts the details of a new incident in the incident channel. This is the
//bread and butter of this app. It will also create tickets in external systems such as
//Jira Cloud and Salesforce to ensure that all details realted to the incident are updated
//and tracked in external systems.

import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { incidentHandler } from "../../../utils/blockActionHandlers/incident-buttons-handler.ts";
import { saveNewIncident } from "../../../utils/database/create-incident.ts";
import { createJiraIssue } from "../../../utils/externalAPIs/atlassian/jira/createJiraIssue.ts";
import { postReply } from "../../../utils/slack_apis/post-message.ts";
import { jiraIssueBlocks } from "../../../views/jira-issue-blocks.ts";
import { updateIncident } from "../../../utils/database/update-incident.ts";
import { createSalesforceIncident } from "../../../salesforce/create-salesforce-incident.ts";
import { getSalesforceIncidentBlocks } from "../../../views/salesforce-new-incident-created.ts";
import { allClearModalCallback } from "../../../utils/view_callback_handlers/all-clear-modal-callback.ts";
import { assignDRIModalCallback } from "../../../utils/view_callback_handlers/assign-dri-modal-callback.ts";
import { addParticipantsModalCallback } from "../../../utils/view_callback_handlers/add-participants-modal-callback.ts";
import { sendUpdateModalCallback } from "../../../utils/view_callback_handlers/send-update-modal-callback.ts";
import { editIncidentModalCallback } from "../../../utils/view_callback_handlers/edit-incident-modal-callback.ts";
import { sendMessageClerk } from "../../../utils/externalAPIs/clerk/message-logic.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    const incidentChannel = env["INCIDENT_CHANNEL"];
    const incident = <Incident> inputs;
    incident.short_description = incident.short_description.substring(0, 50);
    incident.incident_status = "OPEN";
    incident.incident_id = "INC-" + (Date.now());
    const createIssueResp = await createJiraIssue(env, incident);
    incident.incident_jira_issue_key = createIssueResp.key;

    const sfIncident = <any> await createSalesforceIncident(
      incident,
      env,
      token,
    );

    if (sfIncident) {
      incident.salesforce_incident_id = sfIncident.incidentId;
    } else {
      console.log("NO INCIDENT ID");
    }

    await saveNewIncident(token, incident);
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

    const sfIncidentBlocks = await getSalesforceIncidentBlocks(
      sfIncident.incidentURL,
    );

    if (sfIncident) {
      incident.salesforce_incident_id = sfIncident.incidentId;
    } else {
      console.log("NO INCIDENT ID");
    }

    await postReply(
      token,
      incidentChannel,
      sfIncidentBlocks,
      postMsgResp.ts,
    );

    incident.leadership_paged = await sendMessageClerk(
      incident,
      env,
      "new",
      token,
    );

    await updateIncident(token, incident);

    return {
      completed: false,
    };
  };

export default postIncident;

export const blockActions = incidentHandler;

//handling for now the various view submissions from button clicks on the incident object.
export const viewSubmission = async (
  { view, token, env, body }: any,
) => {
  if (view.callback_id === "all_clear_modal") {
    await allClearModalCallback(view, token, env);
  }

  if (view.callback_id === "assign_dri_modal") {
    await assignDRIModalCallback(view, token);
  }

  if (view.callback_id === "add_participants_modal") {
    await addParticipantsModalCallback(view, token);
  }

  if (view.callback_id === "send_update_modal") {
    await sendUpdateModalCallback(view, token, env, body.user.id);
  }

  if (view.callback_id === "edit_incident_modal") {
    await editIncidentModalCallback(view, token, env);
  }
};

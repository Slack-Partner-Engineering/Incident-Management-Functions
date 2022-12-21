//This function will take the input from the modal for the close incident and execute the
//needed backed updates (such as update to DB) once the view is submitted. This will
//add a comment to Jira Cloud with the close notes that the user submitted with the closing of the incident.

import { closeSalesforceIncident } from "../../salesforce/close-salesforce-incident.ts";
import { closeIncidentBlocks } from "../../views/close-incident-blocks.ts";
import { allClearNotesBlocks } from "../../views/all-clear-notes-blocks.ts";
import { documentOnIncidentClose } from "../../views/doc-on-incident-close.ts";
import { getIncident } from "../database/get-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { createConfluenceDoc } from "../externalAPIs/atlassian/confluence/create-confluence-page.ts";
import { addJiraComment } from "../externalAPIs/atlassian/jira/addJiraComment.ts";
import { updateJiraPriorityToLow } from "../externalAPIs/atlassian/jira/updateJiraPriority.ts";
import { sendMessageClerk } from "../externalAPIs/clerk/message-logic.ts";
import { addBookmark } from "../slack_apis/add-bookmark.ts";
import { endCall } from "../slack_apis/end-call.ts";
import { postMessage, postReply } from "../slack_apis/post-message.ts";
import { removeBookmark } from "../slack_apis/remove-bookmark.ts";
import { updateMessage } from "../slack_apis/update-message.ts";
import { setTopic } from "../slack_apis/set-topic.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";

const allClearModalCallback = async (
  view: any,
  token: string,
  env: any,
) => {
  const allClearTS = ((Date.now()) / 1000);
  // save the currentTime so that we know what time the incident was closed
  const incidentID = await JSON.parse(view.private_metadata).incident_id;
  const incident = await getIncident(token, incidentID);
  const comment =
    view.state.values.add_comment_block.close_incident_action.value;

  incident.incident_status = "ALL CLEAR";
  incident.incident_close_notes = comment;
  incident.incident_closed_ts = allClearTS;
  const incidentJiraKey = incident.incident_jira_issue_key;
  await closeSalesforceIncident(incident, env, token);
  await sendMessageClerk(incident, env, "close", token);

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

    await setTopic(
      token,
      curIncident.incident_swarming_channel_id,
      `ALL CLEAR ${incident.long_description?.substring(0, 250)}`,
    );

    await updateMessage(
      token,
      incident.incident_swarming_channel_id,
      incident.incident_swarming_msg_ts,
      closeBlocks,
    );

    const rcaURL = await createConfluenceDoc(env, incident);
    const incidentCloseDocumentBlocks = documentOnIncidentClose(rcaURL);

    const rca_bookmark = await addBookmark(
      token,
      incident.incident_swarming_channel_id,
      "RCA Template",
      "link",
      rcaURL,
      ":confluence:",
    );
    if (rca_bookmark != undefined) {
      incident.rca_doc_bookmark_id = rca_bookmark.bookmark.id;
    }
    const closeNoteBlocks = await allClearNotesBlocks(comment);
    // send a message to the swarming channel saying that the issue has been called closed
    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      closeNoteBlocks,
    );

    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      incidentCloseDocumentBlocks,
    );
  } else {
    // send a message to the main incidents channel saying that the issue has been called closed
    const closeNoteBlocks = await allClearNotesBlocks(comment);
    await postReply(
      token,
      incident.incident_channel,
      closeNoteBlocks,
      incident.incident_channel_msg_ts,
    );
  }
  await updateIncident(token, incident);
  await updateSalesforceIncident(incident, env, token);
};

export { allClearModalCallback };

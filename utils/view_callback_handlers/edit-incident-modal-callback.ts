//This function will take the input from the modal for the edit interaction
//and change the Jira and Salesforce summary / description. If there is a
//swarming channel this will update that name as well.

import { getIncident } from "../database/get-incident.ts";
import { updateJiraIssue } from "../externalAPIs/atlassian/jira/updateJiraIssue.ts";
import { postMessage } from "../slack_apis/post-message.ts";
import { setTopic } from "../slack_apis/set-topic.ts";
import { updateMessage } from "../slack_apis/update-message.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { newIncident } from "../../views/new-incident.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { editIncidentMessageBlocks } from "../../views/edit-incident-message-blocks.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { postReply } from "../slack_apis/post-message.ts";
import { updateChannelName } from "../slack_apis/update-channel-name.ts";
import {
  createChannelName,
  sanitizeChannelName,
} from "../slack_apis/create-channel.ts";
import { sendMessageClerk } from "../externalAPIs/clerk/message-logic.ts";

const editIncidentModalCallback = async (
  view: any,
  token: string,
  env: any,
) => {
  // save the currentTime so that we know what time the incident was closed
  const incidentID = await JSON.parse(view.private_metadata).incident_id;
  const incident = await getIncident(token, incidentID);
  let newSummary = view.state.values.summary_block.edit_summary_action.value;
  let newLongDesc =
    view.state.values.long_desc_block.edit_long_desc_action.value;
  if (newSummary == undefined) {
    newSummary = "";
  }
  if (newLongDesc == undefined) {
    newLongDesc = "";
  }
  //update the incident object with the new values
  incident.long_description = newLongDesc;
  incident.short_description = newSummary;

  //update Jira with new values
  await updateJiraIssue(env, incident, newSummary, newLongDesc);

  //update Slack DataStore with new values
  await updateIncident(token, incident);

  // check if we are in swarming channel. If we are, we
  // need to use the view without the `Create Channel` button
  const updateIncidentBlocks = await newIncident(incident);
  const swarmIncidentBlocks = await swarmIncident(incident);
  const editIncidentMsgBlocks = await editIncidentMessageBlocks(
    newSummary,
    newLongDesc,
    incident.incident_trigger,
  );

  if (incident.incident_swarming_channel_id !== undefined) {
    await postMessage(
      token,
      <string> incident.incident_swarming_channel_id,
      editIncidentMsgBlocks,
    );
    await updateMessage(
      token,
      <string> incident.incident_swarming_channel_id,
      incident.incident_swarming_msg_ts,
      swarmIncidentBlocks,
    );
    const updatedIncidentChannelBlocks =
      await swarmIncidentOriginalMessageUpdate(
        incident,
      );
    await updateMessage(
      token,
      <string> incident.incident_channel,
      incident.incident_channel_msg_ts,
      updatedIncidentChannelBlocks,
    );

    const channelName = await createChannelName(
      incident.short_description,
      incident.incident_id,
    );

    const santizedChannelName = await sanitizeChannelName(channelName);

    await updateChannelName(
      token,
      incident.incident_swarming_channel_id,
      santizedChannelName,
    );

    await setTopic(
      token,
      incident.incident_swarming_channel_id,
      `Major Incident Channel: ${incident.long_description?.substring(0, 250)}`,
    );

    await updateSalesforceIncident(incident, env, token);
  } else {
    await postReply(
      token,
      <string> incident.incident_channel,
      editIncidentMsgBlocks,
      incident.incident_channel_msg_ts,
    );
    await updateMessage(
      token,
      <string> incident.incident_channel,
      incident.incident_channel_msg_ts,
      updateIncidentBlocks,
    );
    await updateSalesforceIncident(incident, env, token);
    await sendMessageClerk(incident, env, "edit", token);
  }
};

export { editIncidentModalCallback };

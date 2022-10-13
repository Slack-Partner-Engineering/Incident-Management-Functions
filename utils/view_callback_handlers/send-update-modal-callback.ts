import { getIncident } from "../database/get-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { postMessage } from "../slack_apis/post-message.ts";
import { postReply } from "../slack_apis/post-message.ts";
import { sendUpdateMessageBlocks } from "../../views/send-update-message-blocks.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";
import { addJiraComment } from "../externalAPIs/atlassian/addJiraComment.ts";
import { sendMessageClerk } from "../externalAPIs/clerk/message-logic.ts";

const sendUpdateModalCallback = async (
  view: any,
  token: string,
  env: any,
  updateUser: string,
) => {
  const incidentID = await JSON.parse(view.private_metadata).incident_id;
  const incident = await getIncident(token, incidentID);
  const update = view.state.values.send_update_block.send_update_action.value;
  const incidentJiraKey = incident.incident_jira_issue_key;
  //The update should be sent to the appropriate Jira ticket via a comment
  await addJiraComment(
    env,
    incidentJiraKey,
    update,
  );

  //add field to incident, last update, that way audit will alwys show.
  incident.last_incident_update = update;
  incident.last_incident_update_ts = Date.now();
  await updateIncident(token, incident);

  const updateBlocks = await sendUpdateMessageBlocks(update, updateUser);

  if (incident.incident_swarming_channel_id !== undefined) {
    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      updateBlocks,
    );
  } else {
    await postReply(
      token,
      incident.incident_channel,
      updateBlocks,
      incident.incident_channel_msg_ts,
    );
  }

  //send an update to Salesforce all the time
  await updateSalesforceIncident(incident, env, token);
  await sendMessageClerk(incident, env, "update");
  //send update to jira all the time

  //check if incident is a swarm or it is critical, if so send an update to SMS via clerk
};

export { sendUpdateModalCallback };

//This function will take the previous priority and decrease it
//input: standard incident object, env, token, body
//output: channel URL, channel_id, incident object.
//
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { Incident } from "../../types/incident-object.ts";
import { decreaseJiraPriority } from "../../utils/externalAPIs/atlassian/decreaseJiraPriority.ts";
import { getJiraPriority } from "../../utils/externalAPIs/atlassian/getJiraPriority.ts";
import { getPriorityDecreasedBlocks } from "../../views/get-priority-decreased-blocks.ts";
import { getIncident } from "../../utils/database/get-incident.ts";

export const deEscalateIncident = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const jiraIssueKey = incident.incident_jira_issue_key;
  const previousPriority = await getJiraPriority(env, jiraIssueKey);
  await decreaseJiraPriority(env, jiraIssueKey);
  const newPriority = await getJiraPriority(env, jiraIssueKey);
  const priorityBlocks = getPriorityDecreasedBlocks(
    previousPriority,
    newPriority,
  );

  const curIncident = await getIncident(token, <string> incident.incident_id);

  if (incident.incident_swarming_channel_id !== undefined) {
    const reply = await postReply(
      token,
      <string> curIncident.incident_swarming_channel_id,
      priorityBlocks,
      curIncident.incident_swarming_msg_ts,
    );
  } else {
    const reply = await postReply(
      token,
      <string> curIncident.incident_channel,
      priorityBlocks,
      curIncident.incident_channel_msg_ts,
    );
  }
};

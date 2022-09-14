//This function should take in the standard incident object from various triggers.
//It should then create the incident channel, etc... to kick off the process.
//input: standard incident object
//output: channel URL, channel_id, incident object.
//
import { postMessage } from "../../utils/slack_apis/post-message.ts";
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { jiraIssueBlocks } from "../../views/jira-issue-blocks.ts";
import { createZoomMeeting } from "../../utils/externalAPIs/zoom/createMeeting.ts";
import { createChannel } from "../../utils/slack_apis/create-channel.ts";
import { getIncidentChannelBlocks } from "../../views/get-channel-blocks.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { getZoomBlock } from "../../views/zoom-call-blocks.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { inviteUserToChannel } from "../../utils/slack_apis/invite-user-to-channel.ts";
import { addBookmark } from "../../utils/slack_apis/add-bookmark.ts";
import { getBoxRunbook } from "../../views/box-runbok-blocks.ts";
import { addCall } from "../../utils/slack_apis/add-call.ts";
import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { setTopic } from "../../utils/slack_apis/set-topic.ts";
import { increaseJiraPriority } from "../../utils/externalAPIs/atlassian/increaseJiraPriority.ts";
import { getJiraPriority } from "../../utils/externalAPIs/atlassian/getJiraPriority.ts";
import { getPriorityChangedBlocks } from "../../views/get-priority-changed-blocks.ts";
import { getIncident } from "../../utils/database/get-incident.ts";

export const escalateIncident = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const jiraIssueKey = incident.incident_jira_issue_key;
  const previousPriority = await getJiraPriority(env, jiraIssueKey);
  console.log("previous priority");
  console.log(previousPriority);
  await increaseJiraPriority(env, jiraIssueKey);
  const newPriority = await getJiraPriority(env, jiraIssueKey);
  console.log("newPriority priority");
  console.log(newPriority);
  console.log("hit escalate statement");
  console.log("incident");
  console.log(incident);
  const priorityBlocks = getPriorityChangedBlocks(
    previousPriority,
    newPriority,
  );

  const curIncident = getIncident(token, <string> incident.incident_id);
  console.log(curIncident);

  if (incident.incident_swarming_channel_id !== undefined) {
    console.log(incident.incident_swarming_channel_id);
    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      priorityBlocks,
    );
    // post to swarming channel (normal chat.postMessage)
  } else {
    console.log("going into post reply");
    const reply = await postReply(
      token,
      <string> incident.incident_channel,
      priorityBlocks,
      incident.incident_channel_msg_ts,
    );
    console.log(reply);
  }
};

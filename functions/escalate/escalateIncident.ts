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
import { getPriorityIncreasedBlocks } from "../../views/get-priority-increased-blocks.ts";
import { getIncident } from "../../utils/database/get-incident.ts";

export const escalateIncident = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);
  const curSeverity = curIncident.severity;
  let newSeverity;
  switch (curSeverity) {
    case "Low": {
      newSeverity = "Medium";
      break;
    }
    case "Medium": {
      newSeverity = "High";
      break;
    }
    case "High": {
      newSeverity = "Critical";
      break;
    }
  }

  const priorityBlocks = getPriorityIncreasedBlocks(
    curSeverity,
    newSeverity,
  );

  if (incident.incident_swarming_channel_id !== undefined) {
    console.log(incident.incident_swarming_channel_id);
    const reply = await postReply(
      token,
      <string> curIncident.incident_swarming_channel_id,
      priorityBlocks,
      curIncident.incident_swarming_msg_ts,
    );

    // post to swarming channel (normal chat.postMessage)
  } else {
    console.log("going into post reply");
    console.log(incident);
    const reply = await postReply(
      token,
      <string> curIncident.incident_channel,
      priorityBlocks,
      curIncident.incident_channel_msg_ts,
    );
    console.log(reply);
  }
};

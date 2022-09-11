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

export const newSwarmChannel = async (
  incident: any,
  env: any,
  token: any,
  body: any,
) => {
  const shortDescription = incident.short_description;
  const meetingResp = await createZoomMeeting(env);
  const incidenId = incident.incident_id;
  const createChannelResp = await createChannel(
    token,
    shortDescription,
    incidenId,
  );
  const channelBlocks = await getIncidentChannelBlocks(createChannelResp);
  await postReply(
    token,
    body.container.channel_id,
    channelBlocks,
    body.container.message_ts,
  );
  const updatedIncidentBlocks = await swarmIncident(incident);
  await postMessage(
    token,
    createChannelResp.channel.id,
    updatedIncidentBlocks,
  );
  await addBookmark(
    token,
    createChannelResp.channel.id,
    "Incident Runbook",
    "link",
    `https://gregg.box.com/fakeACcount`,
    ":boxcorp:",
  );
  const boxRunbook = await getBoxRunbook();
  await postMessage(
    token,
    createChannelResp.channel.id,
    boxRunbook,
  );
  const jiraIssueMessage = await jiraIssueBlocks(
    env,
    incident,
  );
  await postMessage(
    token,
    createChannelResp.channel.id,
    jiraIssueMessage,
  );
  await addBookmark(
    token,
    createChannelResp.channel.id,
    "Dev Ticket",
    "link",
    `https://${
      env["JIRA_INSTANCE"]
    }/browse/${incident.incident_jira_issue_key}`,
    ":atlassian:",
  );
  const callBlockId = await addCall(meetingResp.join_url, Date.now(), token);
  const zoomBlocks = await getZoomBlock(
    callBlockId.call.id,
  );
  await postMessage(
    token,
    createChannelResp.channel.id,
    zoomBlocks,
  );
  await addBookmark(
    token,
    createChannelResp.channel.id,
    "Incident Call",
    "link",
    meetingResp.join_url,
    ":zoom:",
  );
  await inviteUserToChannel(
    body.user.id,
    createChannelResp.channel.id,
    token,
  );
  await updateMessage(
    token,
    incident.incident_channel,
    body.message.ts,
    updatedIncidentBlocks,
  );
};

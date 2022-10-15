//This function takes in the standard incident object from various triggers.
//It should then create the incident channel and post into channel to kick off the swarming incident.
//It will create a Zoom call, post it in channel, and add bookmarks to the Jira and Salesforce tickets created.

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
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { getSalesforceIncidentBlocks } from "../../views/salesforce-new-incident-created.ts";
import { getObjectURL } from "../../salesforce/sf_connector/build-object-url.ts";
import { sendMessageClerk } from "../../utils/externalAPIs/clerk/message-logic.ts";

export const newSwarmChannel = async (
  incident: Incident,
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
    <string> incidenId,
  );

  const channelBlocks = await getIncidentChannelBlocks(createChannelResp);
  // Add message to the original incident channel to notify others of the newly created swarming channel.
  await postReply(
    token,
    body.container.channel_id,
    channelBlocks,
    body.container.message_ts,
  );
  const updatedIncidentBlocks = await swarmIncident(incident);
  const initialMessage = await postMessage(
    token,
    createChannelResp.channel.id,
    updatedIncidentBlocks,
  );
  incident.incident_swarming_channel_id = initialMessage.channel;
  incident.incident_swarming_msg_ts = initialMessage.message.ts;

  const updatedIncidentChannelBlocks = await swarmIncidentOriginalMessageUpdate(
    incident,
  );
  await updateMessage(
    token,
    <string> incident.incident_channel,
    body.message.ts,
    updatedIncidentChannelBlocks,
  );

  const sfIncidentURL = getObjectURL(incident.salesforce_incident_id, env);

  const sfIncidentBlocks = await getSalesforceIncidentBlocks(
    sfIncidentURL,
  );
  await postMessage(
    token,
    createChannelResp.channel.id,
    sfIncidentBlocks,
  );
  await addBookmark(
    token,
    createChannelResp.channel.id,
    "Salesforce Incident",
    "link",
    sfIncidentURL,
    ":salesforce:",
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
  incident.incident_call_id = callBlockId.call.id;

  await postMessage(
    token,
    createChannelResp.channel.id,
    zoomBlocks,
  );
  const zoomBookmark: any = await addBookmark(
    token,
    createChannelResp.channel.id,
    "Incident Call",
    "link",
    meetingResp.join_url,
    ":zoom:",
  );
  incident.zoom_call_bookmark_id = zoomBookmark.bookmark.id;
  await updateIncident(token, incident);

  await inviteUserToChannel(
    body.user.id,
    createChannelResp.channel.id,
    token,
  );

  await setTopic(
    token,
    createChannelResp.channel.id,
    `Major Incident Channel: ${incident.long_description?.substring(0, 250)}`,
  );

  await sendMessageClerk(incident, env, "swarm");
};

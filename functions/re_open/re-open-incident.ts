//This function should reopen the incident. It will change the status from Closed to Open.
//It should clear the end time of the incident, and update the database.
//If there is a swarm, it should update incident message in swarm channel, and re open the call block, and set the topic again.
//input: standard incident object, env, token
//output: channel URL, channel_id, incident object.

import { postMessage } from "../../utils/slack_apis/post-message.ts";
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { getIncident } from "../../utils/database/get-incident.ts";
import { newIncident } from "../../views/new-incident.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";
import { reOpenIncidentMessageBlocks } from "../../views/re-open-message-blocks.ts";
import { setTopic } from "../../utils/slack_apis/set-topic.ts";
import { createZoomMeeting } from "../../utils/externalAPIs/zoom/createMeeting.ts";
import { addCall } from "../../utils/slack_apis/add-call.ts";
import { getZoomBlock } from "../../views/zoom-call-blocks.ts";
import { sendMessageClerk } from "../../utils/externalAPIs/clerk/message-logic.ts";
import { addBookmark } from "../../utils/slack_apis/add-bookmark.ts";
import { removeBookmark } from "../../utils/slack_apis/remove-bookmark.ts";
import { unarchiveChannel } from "../../utils/slack_apis/unarchive-channel.ts";

export const reOpen = async (
  incident: Incident,
  env: any,
  token: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);

  curIncident.incident_status = "OPEN";
  curIncident.incident_closed_ts = "";

  // need to use the view without the `Create Channel` button
  const updateIncidentBlocks = await newIncident(curIncident);
  const reOpenMessageBlocks = await reOpenIncidentMessageBlocks(
    incident.incident_trigger,
  );
  const swarmIncidentBlocks = await swarmIncident(curIncident);

  // check if we are in swarming channel. If we are, we
  if (curIncident.incident_swarming_channel_id !== undefined) {
    await postMessage(
      token,
      <string> curIncident.incident_swarming_channel_id,
      reOpenMessageBlocks,
    );
    await updateMessage(
      token,
      <string> curIncident.incident_swarming_channel_id,
      curIncident.incident_swarming_msg_ts,
      swarmIncidentBlocks,
    );
    const updatedIncidentChannelBlocks =
      await swarmIncidentOriginalMessageUpdate(
        curIncident,
      );
    await updateMessage(
      token,
      <string> curIncident.incident_channel,
      curIncident.incident_channel_msg_ts,
      updatedIncidentChannelBlocks,
    );
    await setTopic(
      token,
      curIncident.incident_swarming_channel_id,
      `Major Incident Channel: ${incident.long_description?.substring(0, 250)}`,
    );
    const meetingResp = await createZoomMeeting(env);
    const callBlockId = await addCall(meetingResp.join_url, Date.now(), token);
    const zoomBlocks = await getZoomBlock(
      callBlockId.call.id,
    );
    incident.incident_call_id = callBlockId.call.id;

    //remove the RCA bookmark, since if we don't it will keep adding multiple RCA docs
    await removeBookmark(
      token,
      curIncident.incident_swarming_channel_id,
      curIncident.rca_doc_bookmark_id,
    );

    await postMessage(
      token,
      <string> curIncident.incident_swarming_channel_id,
      zoomBlocks,
    );
    const zoomBookmark: any = await addBookmark(
      token,
      <string> curIncident.incident_swarming_channel_id,
      "Incident Call",
      "link",
      meetingResp.join_url,
      ":zoom:",
    );

    incident.zoom_call_bookmark_id = zoomBookmark.bookmark.id;
    await updateIncident(token, incident);
    await unarchiveChannel(token, curIncident.incident_swarming_channel_id);

    //not a swarm
  } else {
    await postReply(
      token,
      <string> curIncident.incident_channel,
      reOpenMessageBlocks,
      curIncident.incident_channel_msg_ts,
    );
    await updateMessage(
      token,
      <string> curIncident.incident_channel,
      curIncident.incident_channel_msg_ts,
      updateIncidentBlocks,
    );
    await updateSalesforceIncident(curIncident, env, token);
  }
  await updateSalesforceIncident(curIncident, env, token);
  await sendMessageClerk(curIncident, env, "reopen", token);
};

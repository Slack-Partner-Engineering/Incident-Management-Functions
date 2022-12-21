import { postMessage, postReply } from "../../slack_apis/post-message.ts";
import { clerkNotificationBlocks } from "../../../views/clerk-notification.ts";
import { Incident } from "../../../types/incident-object.ts";

const notififySlackChannelClerk = async (
  token: string,
  incident: Incident,
) => {
  const blocks = clerkNotificationBlocks();

  if (incident.incident_swarming_channel_id !== undefined) {
    await postMessage(
      token,
      <string> incident.incident_swarming_channel_id,
      blocks,
    );
  } else {
    await postReply(
      token,
      <string> incident.incident_channel,
      blocks,
      incident.incident_channel_msg_ts,
    );
  }
};

export { notififySlackChannelClerk };

import { Incident } from "../../../types/incident-object.ts";
import { newIncidentClerk } from "./messages/new-incident-message.ts";
import { sendMessageToClerkAPI } from "./send-message-clerk.ts";
import { generateNumbers } from "./generate-numbers.ts";
import { escalateIncidentClerk } from "./messages/escalated-incident-message.ts";
import { deescalateIncidentClerk } from "./messages/deescalated-incident-message.ts";
import { swarmIncidentClerk } from "./messages/swarm-started-incident-message.ts";
import { updateIncidentClerk } from "./messages/update-incident-message.ts";
import { closeIncidentClerk } from "./messages/close-incident-message.ts";
import { editIncidentClerk } from "./messages/edit-incident-message.ts";
import { reopenIncidentClerk } from "./messages/reopen-incident-message.ts";
import { notififySlackChannelClerk } from "./notify-slack-channel.ts";

const sendMessageClerk = async (
  incident: Incident,
  env: any,
  status: string,
  token: string,
) => {
  if (
    incident.severity === env["CLERK_NOTIFICATION_LEVEL"] ||
    incident.incident_swarming_channel_id !== undefined
  ) {
    let message = "";
    switch (status) {
      case "new": {
        message = await newIncidentClerk(incident);
        await notififySlackChannelClerk(
          token,
          incident,
        );
        break;
      }
      case "escalated": {
        message = await escalateIncidentClerk(incident);
        await notififySlackChannelClerk(
          token,
          incident,
        );
        break;
      }
      case "deescalated": {
        message = await deescalateIncidentClerk(incident);
        break;
      }
      case "swarm": {
        message = await swarmIncidentClerk(incident);
        await notififySlackChannelClerk(
          token,
          incident,
        );
        break;
      }
      case "update": {
        message = await updateIncidentClerk(incident);
        break;
      }
      case "close": {
        message = await closeIncidentClerk(incident);
        break;
      }
      case "edit": {
        message = await editIncidentClerk(incident);
        break;
      }
      case "reopen": {
        message = await reopenIncidentClerk(incident);
        break;
      }
      default:
        break;
    }
    const phoneNumbers = await generateNumbers(env);
    sendMessageToClerkAPI(message, phoneNumbers, env);
    return true; //a page went out
  }
  return false; //no one was paged
};

export { sendMessageClerk };

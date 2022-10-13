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

const sendMessageClerk = async (
  incident: Incident,
  env: any,
  status: string,
) => {
  if (
    incident.severity === env["CLERK_NOTIFICATION_LEVEL"] ||
    incident.incident_swarming_channel_id !== undefined
  ) {
    let message = "";
    switch (status) {
      case "new": {
        message = await newIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "escalated": {
        message = await escalateIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "deescalated": {
        message = await deescalateIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "swarm": {
        message = await swarmIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "update": {
        message = await updateIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "close": {
        message = await closeIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "edit": {
        message = await editIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "reopen": {
        message = await reopenIncidentClerk(incident);
        const phoneNumbers = await generateNumbers(env);
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      default:
        break;
    }
    return true; //a page went out
  }
  return false; //no one was paged
};

export { sendMessageClerk };

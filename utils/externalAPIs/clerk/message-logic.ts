//logic to determoine if a SMS should be sent or not.
//ie, only if critical or in a swarm
// this is called when an issue is created, escalated to critical, swarm is created (and it's not already critical), also called whenever an issue is closed, or send update is used.
//add value to incident boolean, leadership paged/y/n - use this to not spam leadership

//sendmessageNewIncident
//input, incident
//if appropriate, call get numbers, pass message and numbers to the send message function

//sendmessageEscalToCritical
//input, incident
//if appropriate, call get numbers, pass message and numbers to the send message function

//get numbers to send - call file

//send messages accepts the numbers array, and the message.
import { Incident } from "../../../types/incident-object.ts";
import { newIncidentClerk } from "./messages/new-incident-message.ts";
import { sendMessageToClerkAPI } from "./send-message-clerk.ts";
import { generateNumbers } from "./generate-numbers.ts";

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
        const phoneNumbers = await generateNumbers();
        sendMessageToClerkAPI(message, phoneNumbers, env);
        break;
      }
      case "escalated": {
        break;
      }
      case "deescalated": {
        break;
      }
      case "swarm": {
        break;
      }
      case "update": {
        break;
      }
      case "close": {
        break;
      }
      case "edit": {
        break;
      }
      case "reopen": {
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

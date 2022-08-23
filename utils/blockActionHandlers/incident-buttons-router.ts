import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { createIncident } from "./../../functions/create_incident/button/definition.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
//import { callPostIncident } from "../scripts/call-post-incident.ts";

import { closeIncidentHandler } from "./close-incident-button-handler.ts";

const router = BlockActionsRouter(createIncident);

export const incidentHandler = router.addHandler(
  [
    "close_incident",
    "create_channel",
    "escalate",
    "de_escalate",
    "assign_dri",
    "add_members",
  ],
  async ({ action, body, token }) => {
    const client = SlackAPI(token);

    switch (action.action_id) {
      case "create_channel":
        console.log("hit create channel statement");
        break;

      case "close_incident":
        await closeIncidentHandler(client, action, body, token);
        break;

      case "escalate":
        console.log("hit escalate statement");
        break;

      case "de_escalate":
        console.log("hit de_escalate statement");
        break;

      case "assign_dri":
        console.log("hit assign_dri statement");
        break;

      case "add_members":
        console.log("hit add_members statement");
        break;

      default:
        break;
    }
  },
);

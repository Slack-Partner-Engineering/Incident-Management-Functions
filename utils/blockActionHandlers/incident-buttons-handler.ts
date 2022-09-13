import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { postNewIncident } from "../../functions/send_to_slack/post_incident/definition.ts";
import { openView } from "../slack_apis/open-view.ts";
import { closeIncidentModal } from "../../views/close-incident-modal.ts";
import { newSwarmChannel } from "../../functions/create_incident_channel/incident-management-orchestrator.ts";

const router = BlockActionsRouter(postNewIncident);

export const incidentHandler = router.addHandler(
  [
    "close_incident",
    "create_channel",
    "escalate",
    "de_escalate",
    "assign_dri",
    "add_members",
  ],
  async ({ action, body, token, env }) => {
    const incident = JSON.parse(body.actions[0].value);

    switch (action.action_id) {
      case "create_channel": {
        await newSwarmChannel(incident, env, token, body);
        break;
      }

      case "close_incident": {
        //pass in whole incident obj to view, so we can update the original incident obj later
        const incident = action.value;
        console.log("incident: ");
        console.log(incident);
        const ModalView = await closeIncidentModal(incident);
        await openView(
          token,
          ModalView,
          body.interactivity.interactivity_pointer,
        );
        break;
      }

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

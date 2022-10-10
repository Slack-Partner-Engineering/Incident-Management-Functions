import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { postNewIncident } from "../../functions/send_to_slack/post_incident/definition.ts";
import { openView } from "../slack_apis/open-view.ts";
import { closeIncidentModal } from "../../views/close-incident-modal.ts";
import { newSwarmChannel } from "../../functions/create_incident_channel/incident-management-orchestrator.ts";
import { escalateIncident } from "../../functions/escalate/escalateIncident.ts";
import { deEscalateIncident } from "../../functions/de_escalate/de-escalate-incident.ts";
import { assignDRI } from "../../functions/assign_dri/assignDRI.ts";
import { sendUpdateModal } from "../../views/send-update-modal.ts";
const router = BlockActionsRouter(postNewIncident);

export const incidentHandler = router.addHandler(
  [
    "close_incident",
    "create_channel",
    "escalate",
    "de_escalate",
    "assign_dri",
    "add_members",
    "send_update",
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
        const ModalView = await closeIncidentModal(incident);
        await openView(
          token,
          ModalView,
          body.interactivity.interactivity_pointer,
        );
        break;
      }

      case "send_update": {
        const incident = action.value;
        const ModalView = sendUpdateModal(incident);
        await openView(
          token,
          ModalView,
          body.interactivity.interactivity_pointer,
        );
        break;
      }

      case "escalate": {
        await escalateIncident(incident, env, token);
        break;
      }

      case "de_escalate":
        await deEscalateIncident(incident, env, token);
        break;

      case "assign_dri":
        await assignDRI(incident, env, token, body);
        break;

      default:
        break;
    }
  },
);

//This function routes all button clicks from the incident object UI in Slack, to action handlers
//This includes the following buttons: Close Incident, Escalate, Deescalate, Assign DRI, Add Participants,
// Send Update, Edit, and Re Open

import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { postNewIncident } from "../../functions/send_to_slack/post_incident/definition.ts";
import { openView } from "../slack_apis/open-view.ts";
import { allClearModal } from "../../views/all-clear-modal.ts";
import { newSwarmChannel } from "../../functions/create_incident_channel/incident-management-orchestrator.ts";
import { escalateIncident } from "../../functions/escalate/escalateIncident.ts";
import { deEscalateIncident } from "../../functions/de_escalate/de-escalate-incident.ts";
import { assignDRI } from "../../functions/assign_dri/assignDRI.ts";
import { addParticipants } from "../../functions/add_participants/addParticipants.ts";
import { reOpen } from "../../functions/re_open/re-open-incident.ts";
import { closeAndArchive } from "../../functions/close_and_archive/close-and-archive.ts";
import { sendUpdateModal } from "../../views/send-update-modal.ts";
import { editIncidentModal } from "../../views/edit-incident-modal.ts";
const router = BlockActionsRouter(postNewIncident);

export const incidentHandler = router.addHandler(
  [
    "all_clear",
    "create_channel",
    "escalate",
    "de_escalate",
    "assign_dri",
    "add_participants",
    "send_update",
    "edit",
    "re_open",
    "close_and_archive",
  ],
  async ({ action, body, token, env }) => {
    const incident = JSON.parse(body.actions[0].value);

    switch (action.action_id) {
      case "create_channel": {
        await newSwarmChannel(incident, env, token, body);
        break;
      }

      case "all_clear": {
        //pass in whole incident obj to view, so we can update the original incident obj later
        const incident = action.value;
        const ModalView = await allClearModal(incident);
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
        await assignDRI(incident, token, body);
        break;

      case "add_participants":
        await addParticipants(incident, token, body);
        break;

      case "re_open":
        await reOpen(incident, env, token);
        break;

      case "close_and_archive":
        await closeAndArchive(incident, env, token);
        break;

      case "edit": {
        const incident = action.value;
        const ModalView = await editIncidentModal(incident);
        await openView(
          token,
          ModalView,
          body.interactivity.interactivity_pointer,
        );
        break;
      }

      default:
        break;
    }
  },
);

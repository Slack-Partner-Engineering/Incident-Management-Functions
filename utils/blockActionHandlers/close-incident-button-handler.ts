import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { createIncident } from "./../../functions/create_incident/button/definition.ts";
import { SlackAPI } from "deno-slack-api/mod.ts"
import { callPostIncident } from "../scripts/call-post-incident.ts";

import {
  closeIncidentModal
} from "../../views/close-incident-modal.ts"

const router = BlockActionsRouter(createIncident);

export const closeIncidentHandler = router.addHandler(
  ["close_incident"],
  async ({ action, body, token }) => {
    console.log("testing the block actions router");
  
    console.log(body)
    //get the modal view from the views folder
    const ModalView = await closeIncidentModal(
      action.value,
    );

    const client = SlackAPI(token);
    //open the modal with the view which we created above
    await client.views.open({
      trigger_id: body.trigger_id,
      view: ModalView,
    });
  }
);

export const viewSubmission = async ({ body, view, inputs, token }: any) => {
  if (view.callback_id === "close_incident_modal") {
    console.log('inside close incident modal')
    await callPostIncident(view, token, body, inputs)

  }
};

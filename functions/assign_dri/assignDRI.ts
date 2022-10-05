//This function should take in the standard incident object.
//It stringifies the incident to be pushed to a view
//It then passes off execution to open a modal.

import { Incident } from "../../types/incident-object.ts";
import { assignDRIModal } from "../../views/assing-dri-modal.ts";
import { openView } from "../../utils/slack_apis/open-view.ts";

export const assignDRI = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const incidentStr = await JSON.stringify(incident);
  const driModal = await assignDRIModal(incidentStr);
  await openView(
    token,
    driModal,
    body.interactivity.interactivity_pointer,
  );
  console.log("after open view");
};

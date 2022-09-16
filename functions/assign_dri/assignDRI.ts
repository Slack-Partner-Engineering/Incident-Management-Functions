//This function should take in the standard incident object from various triggers.
//It should then create the incident channel, etc... to kick off the process.
//input: standard incident object
//output: channel URL, channel_id, incident object.
//
import { postMessage } from "../../utils/slack_apis/post-message.ts";
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { getIncident } from "../../utils/database/get-incident.ts";
import { newIncident } from "../../views/new-incident.ts";
import { incidentHandler } from "../../utils/blockActionHandlers/incident-buttons-handler.ts";
import { assignDRIModal } from "../../views/assing-dri-modal.ts";
import { openView } from "../../utils/slack_apis/open-view.ts";

export const assignDRI = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);
  const incidentStr = await JSON.stringify(incident);
  const driModal = await assignDRIModal(incidentStr);
  await openView(
    token,
    driModal,
    body.interactivity.interactivity_pointer,
  );
  console.log("after open view");
};

export const viewSubmission = async (
  { view, body, token, env }: any,
) => {
  if (view.callback_id === "assign_dri_modal") {
    console.log("assign dri modal submitted");
  }
};

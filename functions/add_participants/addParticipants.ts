//This function opens a modal to assign a DRI to the incident. This is the main person
//responsible for resolving the incident.
//This function should take in the standard incident object.
//It stringifies the incident to be pushed to a view.
//It then passes off execution to open a modal.

import { Incident } from "../../types/incident-object.ts";
import { addParticipantsModal } from "../../views/add-participants-modal.ts";
import { openView } from "../../utils/slack_apis/open-view.ts";

export const addParticipants = async (
  incident: Incident,
  token: any,
  body: any,
) => {
  const incidentStr = await JSON.stringify(incident);
  const participantsModal = await addParticipantsModal(incidentStr);
  await openView(
    token,
    participantsModal,
    body.interactivity.interactivity_pointer,
  );
};

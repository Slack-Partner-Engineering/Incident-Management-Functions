//This is the main incident view. It is what is shown when a new incident is created.
//Same view used whether incident created via button click or webhook.
import type { Incident } from "../../types/incident-object.ts";

const parseParticipants = (incidentObject: Incident) => {
  // Must parse the incident object since it is stored as a string,
  // and we need to parse it as an object
  let participants = "";
  let participantsArr;
  if (incidentObject.incident_participants !== undefined) {
    participantsArr = JSON.parse(incidentObject.incident_participants);
    for (let i = 0; i < participantsArr.length; i++) {
      participants += `<@${participantsArr[i]}> `;
    }
  }

  return participants;
};

export { parseParticipants };

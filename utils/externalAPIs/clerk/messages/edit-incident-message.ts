import { Incident } from "../../../../types/incident-object.ts";

const editIncidentClerk = (incident: Incident) => {
  const message =
    `An incident has been edited.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.incident_close_notes}`;
  return message;
};

export { editIncidentClerk };

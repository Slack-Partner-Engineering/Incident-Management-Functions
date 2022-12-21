import { Incident } from "../../../../types/incident-object.ts";

const closeIncidentClerk = (incident: Incident) => {
  const message =
    `The incident has been RESOLVED.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.incident_close_notes}`;
  return message;
};

export { closeIncidentClerk };

import { Incident } from "../../../../types/incident-object.ts";

const closeIncidentClerk = (incident: Incident) => {
  console.log(incident.short_description);

  const message =
    `The incident has been closed.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.incident_close_notes}`;
  return message;
};

export { closeIncidentClerk };
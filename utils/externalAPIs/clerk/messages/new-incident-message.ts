import { Incident } from "../../../../types/incident-object.ts";

const newIncidentClerk = (incident: Incident) => {
  const message =
    `A new Critical incident has been created.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.long_description}`;
  return message;
};

export { newIncidentClerk };

import { Incident } from "../../../../types/incident-object.ts";

const escalateIncidentClerk = (incident: Incident) => {
  const message =
    `An incident has been escalated.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\nNew Severity:${incident.severity}\n\n${incident.long_description}`;
  return message;
};

export { escalateIncidentClerk };

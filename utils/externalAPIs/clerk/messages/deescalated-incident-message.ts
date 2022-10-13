import { Incident } from "../../../../types/incident-object.ts";

const deescalateIncidentClerk = (incident: Incident) => {
  console.log(incident.short_description);

  const message =
    `An incident has been deescalated.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\nNew Severity:${incident.severity}`;
  return message;
};

export { deescalateIncidentClerk };

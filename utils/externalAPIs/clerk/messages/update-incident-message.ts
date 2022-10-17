import { Incident } from "../../../../types/incident-object.ts";

const updateIncidentClerk = (incident: Incident) => {
  const message =
    `New Update for incident Id: ${incident.incident_id}\n\n${incident.last_incident_update}`;
  return message;
};

export { updateIncidentClerk };

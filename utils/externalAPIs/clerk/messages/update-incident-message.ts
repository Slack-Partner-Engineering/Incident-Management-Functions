import { Incident } from "../../../../types/incident-object.ts";

const updateIncidentClerk = (incident: Incident) => {
  console.log(incident.short_description);

  const message =
    `New Update for incident Id: ${incident.incident_id}\n\n${incident.last_incident_update}`;
  return message;
};

export { updateIncidentClerk };

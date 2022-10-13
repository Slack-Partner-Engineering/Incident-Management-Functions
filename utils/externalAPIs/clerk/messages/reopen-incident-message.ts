import { Incident } from "../../../../types/incident-object.ts";

const reopenIncidentClerk = (incident: Incident) => {
  console.log(incident.short_description);

  const message =
    `An incident has been reopened.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.incident_close_notes}`;
  return message;
};

export { reopenIncidentClerk };

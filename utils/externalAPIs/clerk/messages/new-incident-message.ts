import { Incident } from "../../../../types/incident-object.ts";

const newIncidentClerk = (incident: Incident) => {
  console.log(incident.short_description);

  const message =
    `A new Critical incident has been created.   Incident Id: ${incident.incident_id}.      ${incident.short_description}           ${incident.long_description}`;
  return message;
};

export { newIncidentClerk };

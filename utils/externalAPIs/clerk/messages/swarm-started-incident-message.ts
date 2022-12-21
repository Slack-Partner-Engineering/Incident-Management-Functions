import { Incident } from "../../../../types/incident-object.ts";

const swarmIncidentClerk = (incident: Incident) => {
  const message =
    `Incident responders have started to swarm on an incident.\n\nIncident Id: ${incident.incident_id}\n\n${incident.short_description}\n\n${incident.long_description}`;
  return message;
};

export { swarmIncidentClerk };

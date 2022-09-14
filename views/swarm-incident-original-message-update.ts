//this view is for when an incident gets its own channel. The incident blocks should no longer have a create channel block and potentially there will
//be different treatments also for this type of incident.
import type { Incident } from "../types/incident-object.ts";

const swarmIncidentOriginalMessageUpdate = (incidentObject: Incident) => {
  //check whether it was triggered by a person or a service
  const incident_creator = incidentObject.external_incident_id
    ? incidentObject.incident_trigger
    : `<@${incidentObject.incident_trigger}>`;

  const incidentDRI = incidentObject.incident_dri
    ? `<@${incidentObject.incident_dri}>`
    : "No one Assigned Currently";

  const dateTime = new Date(<any> incidentObject.incident_start_time * 1000);

  const externalId = incidentObject.external_incident_id
    ? `*External Id*: ${incidentObject.external_incident_id} \n`
    : "";

  let incidentText = "";
  incidentText = incidentText
    .concat(`*A new incident has been created by ${incident_creator} *\n\n`)
    .concat(`*Title*: ${incidentObject.short_description}\n`)
    .concat(`*Severity*: ${incidentObject.severity}\n`)
    .concat(`*Description*: ${incidentObject.long_description}\n`)
    .concat(`*Incident Start Time*: ${dateTime}\n`)
    .concat(`*DRI*: ${incidentDRI}\n`)
    .concat(externalId)
    .concat(`*Incident Id*: ${incidentObject.incident_id}\n`)
    .concat(`*INCIDENT STATUS*: ${incidentObject.incident_status}`)
    .concat(
      `\n\n INCIDENT IS BEING RESOLVED IN :warning: Incident channel <#${incidentObject.incident_swarming_channel_id}>`,
    );
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: incidentText,
      },
    },
  ];

  return blocks;
};

export { swarmIncidentOriginalMessageUpdate };

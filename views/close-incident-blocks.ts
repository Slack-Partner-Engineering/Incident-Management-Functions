import type { Incident } from "../types/incident-object.ts";

const closeIncidentBlocks = async (incidentObject: Incident) => {
  //check whether it was triggered by a person or a service
  const incident_creator = incidentObject.external_incident_id
    ? incidentObject.incident_trigger
    : `<@${incidentObject.incident_trigger}>`;

  const incidentDRI = incidentObject.incident_dri
    ? `<@${incidentObject.incident_dri}>`
    : "No one Assigned Currently";

  const startTime = new Date(<any> incidentObject.incident_start_time * 1000);
  const endTime = new Date(<any> incidentObject.incident_closed_ts);

  const externalId = incidentObject.external_incident_id
    ? `*External Id*: ${incidentObject.external_incident_id} \n`
    : "";

  let incidentText = "";
  incidentText = incidentText
    .concat(`*The incident was created by ${incident_creator} *\n\n`)
    .concat(`*Title*: ${incidentObject.short_description}\n`)
    .concat(`*Severity*: ${incidentObject.severity}\n`)
    .concat(`*Description*: ${incidentObject.long_description}\n`)
    .concat(`*Close Notes*: ${incidentObject.incident_close_notes}\n`)
    .concat(`*Incident Start Time*: ${startTime}\n`)
    .concat(`*Incident End Time*: ${endTime}\n`)
    .concat(`*DRI*: ${incidentDRI}\n`)
    .concat(externalId)
    .concat(`*Incident Id*: ${incidentObject.incident_id}\n`)
    .concat(`*INCIDENT STATUS*: ${incidentObject.incident_status}`);

  const incidentStr = await JSON.stringify(incidentObject);

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: incidentText,
      },
    },
    {
      "type": "actions",
      "block_id": "incident_management_block",
      "elements": [
        {
          "type": "button",
          "action_id": "re_open_action",
          "text": {
            "type": "plain_text",
            "text": "Reopen",
            "emoji": true,
          },
          "value": incidentStr,
        },
      ],
    },
  ];
  return blocks;
};

export { closeIncidentBlocks };

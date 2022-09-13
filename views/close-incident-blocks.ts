//this view is for when an incident gets its own channel. The incident blocks should no longer have a create channel block and potentially there will
//be different treatments also for this type of incident.
import type { Incident } from "../types/incident-object.ts";

const closeIncidentBlocks = async (incidentObject: Incident) => {
  //check whether it was triggered by a person or a service
  const incident_creator = incidentObject.external_incident_id
    ? incidentObject.incident_trigger
    : `<@${incidentObject.incident_trigger}>`;

  const incidentDRI = incidentObject.incident_dri
    ? `<@${incidentObject.incident_dri}>`
    : "";

  const incidentStr = await JSON.stringify(incidentObject);

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*A new incident has been created by ${incident_creator} *\n\n*Title*: ${incidentObject.short_description}\n*Severity*: ${incidentObject.severity}\n*Description*: ${incidentObject.long_description}\n*Incident Start Time*: ${incidentObject.incident_start_time}\n*DRI*: ${incidentDRI}\n*External Id*: ${
            incidentObject.external_incident_id || ""
          }\n*Incident Id*: ${incidentObject.incident_id}\n*INCIDENT STATUS*: ${incidentObject.incident_status}`,
      },
    },
    {
      "type": "actions",
      "block_id": "incident_management_block",
      "elements": [
        {
          "type": "button",
          "action_id": "escalate",
          "text": {
            "type": "plain_text",
            "text": "Escalate",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "de_escalate",
          "text": {
            "type": "plain_text",
            "text": "De-escalate",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "assign_dri",
          "text": {
            "type": "plain_text",
            "text": "Assign DRI",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "add_members",
          "text": {
            "type": "plain_text",
            "text": "Add Members",
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

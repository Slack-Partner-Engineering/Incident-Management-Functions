//This is the main incident view. It is what is shown when a new incident is created.
//Same view used whether incident created via button click or webhook.
import type { Incident } from "../types/incident-object.ts";
import { parseParticipants } from "../utils/scripts/parse-participants.ts";

const newIncident = async (incidentObject: Incident) => {
  //check whether it was triggered by a person or a service
  const incident_creator = incidentObject.external_incident_id
    ? incidentObject.incident_trigger
    : `<@${incidentObject.incident_trigger}>`;

  const incidentDRI = incidentObject.incident_dri
    ? `<@${incidentObject.incident_dri}>`
    : "No one Assigned Currently";

  const longDescription = incidentObject.long_description
    ? `${incidentObject.long_description}`
    : "";

  const participants = await parseParticipants(incidentObject);

  const dateTime = new Date(<any> incidentObject.incident_start_time * 1000);

  let incidentText = "";
  incidentText = incidentText
    .concat(
      `⚠️ ` + `*${incidentObject.incident_id}*` + ": " +
        `*${incidentObject.short_description}*` +
        ` has been created by ${incident_creator} \n\n`,
    )
    .concat(`*Description*: ${longDescription}\n`);

  const incidentStr = await JSON.stringify(incidentObject);

  const blocks: any = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: incidentText,
      },
    },
    {
      "type": "context",
      "elements": [
        {
          "text": "Status: " + `*${incidentObject.incident_status}* `,
          "type": "mrkdwn",
        },
        {
          "text": " ⬆️ Severity: " + `*${incidentObject.severity}*`,
          "type": "mrkdwn",
        },
        {
          "text": " 🙋🏽‍♀️ DRI: " + `*${incidentDRI}*`,
          "type": "mrkdwn",
        },
        {
          "text": " 🙋🏽 Participants: " + `${participants}`,
          "type": "mrkdwn",
        },
        {
          "text": " ⏰ Start Time: " + `*${dateTime}*`,
          "type": "mrkdwn",
        },
      ],
    },
    {
      "type": "actions",
      "block_id": "incident_management_block",
      "elements": [
        {
          "type": "button",
          "action_id": "send_update",
          "text": {
            "type": "plain_text",
            "text": "Send Update",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "create_channel",
          "text": {
            "type": "plain_text",
            "text": "Create Channel",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "close_incident",
          "text": {
            "type": "plain_text",
            "text": "Close Incident",
            "emoji": true,
          },
          "value": incidentStr,
        },
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
          "action_id": "add_participants",
          "text": {
            "type": "plain_text",
            "text": "Add Participants",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "edit",
          "text": {
            "type": "plain_text",
            "text": "Edit",
            "emoji": true,
          },
          "value": incidentStr,
        },
      ],
    },
  ];

  return blocks;
};

export { newIncident };

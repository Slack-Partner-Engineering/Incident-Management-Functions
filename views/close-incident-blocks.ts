//This view builds the incident closed blocks to update the incident messages
//that are in the incident channel and also the swarming channel if it exists.

import type { Incident } from "../types/incident-object.ts";

const closeIncidentBlocks = async (incidentObject: Incident) => {
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

  const startTime = new Date(<any> incidentObject.incident_start_time * 1000);
  const endTime = new Date(<any> incidentObject.incident_closed_ts * 1000);

  let incidentText = "";
  incidentText = incidentText
    .concat(
      `⚠️ ` + `*${incidentObject.incident_id}*` + ": " +
        `*${incidentObject.short_description}*` +
        ` has been created by ${incident_creator} \n\n`,
    )
    .concat(`*Description*: ${longDescription}\n`);

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
          "text": " ⏰ Start Time: " + `*${startTime}*`,
          "type": "mrkdwn",
        },
        {
          "text": " 🕓 End Time: " + `*${endTime}*`,
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
          "action_id": "re_open",
          "text": {
            "type": "plain_text",
            "text": "Reopen",
            "emoji": true,
          },
          "value": incidentStr,
        },
        {
          "type": "button",
          "action_id": "close_and_archive",
          "text": {
            "type": "plain_text",
            "text": "Close and Archive",
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

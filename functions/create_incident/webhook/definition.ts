//This is the definition file of a function.
//The function takes incoming data from a webhook and forms it into what is needed
//for the incident object.

import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const parseWebhook = DefineFunction({
  callback_id: "parseWebhook",
  title: "Parse the incoming webhook data",
  description:
    "Take incoming webhook data normalizes it and builds the incident object",
  source_file: "functions/create_incident/webhook/webhook.ts",
  input_parameters: {
    properties: {
      short_description: {
        description: "Short description of the incident",
        type: Schema.types.string,
      },
      severity: {
        description: "Severity of the incident",
        type: Schema.types.string,
      },
      external_incident_id: {
        description: "External platform's ticket id",
        type: Schema.types.string,
      },
    },
    required: ["short_description", "severity", "external_incident_id"],
  },
  output_parameters: {
    properties: {
      short_description: {
        type: Schema.types.string,
        description: "Short Description",
      },
      severity: {
        type: Schema.types.string,
        description: "Severity",
      },
      long_description: {
        type: Schema.types.string,
        description: "Long Description",
      },
      incident_dri: {
        type: Schema.types.string,
        description: "Incident DRI",
      },
      incident_trigger: {
        type: Schema.types.string,
        description: "Incident Trigger",
      },
      incident_start_time: {
        type: Schema.types.string,
        description: "Start Time",
      },
      external_incident_id: {
        type: Schema.types.string,
        description: "External Id for the incident",
      },
      incident_id: {
        type: Schema.types.string,
        description: "Slack Id for the incident",
      },
      incident_channel: {
        type: Schema.types.string,
        description: "Slack Channel for the incident",
      },
    },
    required: ["short_description", "severity", "incident_trigger"],
  },
});

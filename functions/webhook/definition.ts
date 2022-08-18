import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const parseWebhook = DefineFunction({
  callback_id: "parseWebhook",
  title: "Parse the incoming webhook data",
  description:
    "Take incoming webhook data normalizes it and builds the incident object",
  source_file: "functions/webhook/module.ts",
  input_parameters: {
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
      incident_participants: {
        type: Schema.types.string,
        description: "Incident Participants",
      },
      incident_dri: {
        type: Schema.types.string,
        description: "Incident DRI",
      },
      incident_start_time: {
        type: Schema.types.string,
        description: "Start Time",
      },
    },
    required: ["short_description", "severity"],
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
      incident_participants: {
        type: Schema.types.string,
        description: "Incident Participants",
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
    },
    required: ["short_description", "severity", "incident_trigger"],
  },
});

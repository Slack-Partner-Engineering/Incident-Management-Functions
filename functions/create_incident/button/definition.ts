import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const createIncident = DefineFunction({
  callback_id: "createIncident",
  title: "Create a New Incident",
  description: "Creates a new incident and posts to incident channel",
  source_file: "functions/create_incident/button/create-incident.ts",
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
      incident_trigger: {
        type: Schema.types.string,
        description: "Incident Trigger",
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who created the incident",
      },
      incident_channel: {
        type: Schema.slack.types.channel_id,
      },
      currentTime: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: ["short_description", "severity", "incident_trigger"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

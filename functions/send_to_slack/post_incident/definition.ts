import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const postNewIncident = DefineFunction({
  callback_id: "postNewIncident",
  title: "Post New Incident",
  description: "Posts a new incident to the incident channel",
  source_file: "functions/send_to_slack/post_incident/post-incident.ts",
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
      incident_channel: {
        type: Schema.slack.types.channel_id,
      },
      external_incident_id: {
        type: Schema.types.string,
        description: "External Id",
      },
      incident_id: {
        type: Schema.types.string,
        description: "Slack Incident Id",
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who created the incident",
      },
      currentTime: {
        type: Schema.slack.types.timestamp,
      },
      incident_closed_ts: {
        type: Schema.slack.types.timestamp,
      },
      incident_close_notes: {
        type: Schema.types.string,
      },
    },
    required: ["short_description", "severity", "incident_trigger"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

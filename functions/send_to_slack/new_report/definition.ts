import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const postNewIncidentReport = DefineFunction({
  callback_id: "postNewIncidentReport",
  title: "Post New Incident Report",
  description:
    "Posts a new incident report to the incident channel ephemerally",
  source_file: "functions/send_to_slack/new_report/new-report.ts",
  input_parameters: {
    properties: {
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who wants an incident report",
      },
      currentTime: {
        type: Schema.slack.types.timestamp,
      },
      currentChannel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["currentUser", "currentTime", "currentChannel"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

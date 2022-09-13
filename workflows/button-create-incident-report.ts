//this workflow will create a report of past incidents
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { postNewIncidentReport } from "../functions/send_to_slack/new_report/definition.ts";

// import postIncident from "../functions/send_to_slack/new_incident/new-incident";

export const getIncidentReportButtonWF = DefineWorkflow({
  callback_id: "getIncidentReportButtonWF",
  title: "Create Incident Report",
  description: "Create an incident Report",
  input_parameters: {
    properties: {
      currentUser: {
        type: Schema.slack.types.user_id,
      },
      currentChannel: {
        type: Schema.slack.types.channel_id,
      },
      currentTime: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: [
      "currentUser",
      "currentChannel",
      "currentTime",
    ],
  },
});

getIncidentReportButtonWF.addStep(postNewIncidentReport, {
  currentUser: getIncidentReportButtonWF.inputs.currentUser,
  currentChannel: getIncidentReportButtonWF.inputs.currentChannel,
  currentTime: getIncidentReportButtonWF.inputs.currentTime,
});

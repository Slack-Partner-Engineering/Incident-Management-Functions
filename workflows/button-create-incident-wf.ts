//this workflow creates an incident from a link trigger.
//It takes in details as the current user who invoked the workflow, the time at which the workflow
//was invoked (currentTime), and the channel from which the workflow was invoked.
//The workflow takes more incident details such as a summary, severity, DRI, and long description.
//Once the user submits the open form step, the function calls the postNewIncident custom function
//which creates an incident object, and creates records of the incident in Salesforce and Jira. It
//outputs the incident view, along with buttons to interact with the incident.
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { postNewIncident } from "../functions/send_to_slack/post_incident/definition.ts";

export const postIncidentFromButtonWF = DefineWorkflow({
  callback_id: "postIncidentButtonWF",
  title: "Create Incident",
  description: "Create an incident",
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
      interactivity_context: {
        type: Schema.slack.types.interactivity,
        description: "Interactivity context",
      },
    },
    required: [
      "currentUser",
      "currentChannel",
      "currentTime",
      "interactivity_context",
    ],
  },
});

const postIncidentStep1 = postIncidentFromButtonWF
  .addStep(
    Schema.slack.functions.OpenForm,
    {
      title: "Create an Incident",
      submit_label: "Submit",
      interactivity: postIncidentFromButtonWF.inputs.interactivity_context,
      description: "Incident Form",
      fields: {
        elements: [
          {
            name: "short_description",
            title: "Summary (Limit 50 Characters)",
            type: Schema.types.string,
          },
          {
            name: "severity",
            title: "Severity",
            type: Schema.types.string,
            enum: ["Low", "Medium", "High", "Critical"],
            choices: [{
              title: "Low",
              value: "Low",
            }, {
              title: "Medium",
              value: "Medium",
            }, {
              title: "High",
              value: "High",
            }, {
              title: "Critical",
              value: "Critical",
            }],
          },
          {
            name: "long_description",
            title: "Long description",
            type: Schema.types.string,
          },
          {
            name: "incident_dri",
            title: "Directly Responsible Individual",
            type: Schema.slack.types.user_id,
          },
        ],
        required: ["short_description", "long_description", "severity"],
      },
    },
  );

postIncidentFromButtonWF
  .addStep(postNewIncident, {
    short_description: postIncidentStep1.outputs.fields.short_description,
    severity: postIncidentStep1.outputs.fields.severity,
    long_description: postIncidentStep1.outputs.fields.long_description,
    incident_dri: postIncidentStep1.outputs.fields.incident_dri,
    incident_start_time: postIncidentFromButtonWF.inputs.currentTime,
    incident_trigger: postIncidentFromButtonWF.inputs.currentUser,
    incident_channel: postIncidentFromButtonWF.inputs.currentChannel,
  });

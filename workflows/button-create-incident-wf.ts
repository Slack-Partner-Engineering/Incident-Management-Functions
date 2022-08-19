//this workflow should deal with an incoming incident from a webhook.
//takes in a stringified json body for now (refactor will take in values later)
//sends the data to the incoming webhook function to normalize the data
//sends the incident management object then to the new incident send to slack function to post the details in channel.
//it will in the future call the inident orchestrator function too to kick off the new incident process.
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { createIncident } from "../functions/create_incident/button/definition.ts";

export const createIncidentWF = DefineWorkflow({
  callback_id: "createIncidentFromButtonWF",
  title: "Create Incident",
  description: "Create an incident by starting a workflow from a link trigger.",
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
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["currentUser", "currentChannel"],
  },
});

const CreateIncidentStep1 = createIncidentWF
  .addStep(
    Schema.slack.functions.OpenForm,
    {
      title: "Create an Incident",
      submit_label: "Submit",
      interactivity: createIncidentWF.inputs.interactivity_context,
      description: "Incident Form",
      fields: {
        elements: [
          {
            name: "short_description",
            title: "Summary",
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
            name: "incident_participants",
            title: "Participant emails",
            type: Schema.types.string,
          },
          {
            name: "incident_dri",
            title: "Directly Responsible Individual",
            type: Schema.slack.types.user_id,
          },
        ],
        required: ["short_description", "severity"],
      },
    },
  );

createIncidentWF
  .addStep(createIncident, {
    short_description: CreateIncidentStep1.outputs.fields.short_description,
    severity: CreateIncidentStep1.outputs.fields.severity,
    long_description: CreateIncidentStep1.outputs.fields.long_description,
    incident_participants:
      CreateIncidentStep1.outputs.fields.incident_participants,
    incident_dri: CreateIncidentStep1.outputs.fields.incident_dri,
    incident_start_time: createIncidentWF.inputs.currentTime,
    incident_trigger: createIncidentWF.inputs.currentUser,
    incident_channel: createIncidentWF.inputs.currentChannel,
  });

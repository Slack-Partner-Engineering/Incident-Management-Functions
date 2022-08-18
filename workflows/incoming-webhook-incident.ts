//this workflow should deal with an incoming incident from a webhook.
//takes in a stringified json body for now (refactor will take in values later)
//sends the data to the incoming webhook function to normalize the data
//sends the incident management object then to the new incident send to slack function to post the details in channel.
//it will in the future call the inident orchestrator function too to kick off the new incident process.
import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

import { postNewIncident } from "../functions/send_to_slack/new_incident/definition.ts";
import { parseWebhook } from "../functions/webhook/definition.ts";

export const runFromExternalWebhook = DefineWorkflow({
  callback_id: "createIncidentExternalWebhook",
  title: "Webhook Create Incident",
  description:
    "Create an incident from a webhook called by an external platform",
  input_parameters: {
    properties: {
      body: {
        description: "JSON string body for parsing.",
        type: Schema.types.string,
      },
    },
    required: ["body"],
  },
});

const parseBodyStep = runFromExternalWebhook.addStep(parseWebhook, {
  body: runFromExternalWebhook.inputs.body,
});

runFromExternalWebhook.addStep(postNewIncident, {
  short_description: parseBodyStep.outputs.short_description,
  severity: parseBodyStep.outputs.severity,
  long_description: parseBodyStep.outputs.long_description,
  incident_participants: parseBodyStep.outputs.incident_participants,
  incident_dri: parseBodyStep.outputs.incident_dri,
  incident_start_time: parseBodyStep.outputs.incident_start_time,
  incident_trigger: parseBodyStep.outputs.incident_trigger,
});

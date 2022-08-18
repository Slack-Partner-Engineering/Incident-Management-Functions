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
});

const parseBodyStep = runFromExternalWebhook.addStep(parseWebhook, {
  short_description: runFromExternalWebhook.inputs.short_description,
  severity: runFromExternalWebhook.inputs.severity,
  external_incident_id: runFromExternalWebhook.inputs.external_incident_id,
});

runFromExternalWebhook.addStep(postNewIncident, {
  short_description: parseBodyStep.outputs.short_description,
  severity: parseBodyStep.outputs.severity,
  long_description: parseBodyStep.outputs.long_description,
  incident_participants: parseBodyStep.outputs.incident_participants,
  incident_dri: parseBodyStep.outputs.incident_dri,
  incident_start_time: parseBodyStep.outputs.incident_start_time,
  incident_trigger: parseBodyStep.outputs.incident_trigger,
  external_incident_id: parseBodyStep.outputs.external_incident_id,
});

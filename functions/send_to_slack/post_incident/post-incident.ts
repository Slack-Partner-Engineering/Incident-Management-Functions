//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { closeIncidentHandler } from "../../../utils/blockActionHandlers/close-incident-button-handler.ts";
import { callPostIncident } from "../../../utils/scripts/call-post-incident.ts"
import { saveNewIncident } from "../../../utils/database/create-incident.ts"

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    
    const incidentChannel = env["INCIDENT_CHANNEL"];
    console.log(env);
    console.log(inputs);

    const incident = <Incident> inputs;
    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    const blocks = await newIncident(incident);
    console.log(blocks);

    const resp = await postMessage(
      token,
      incidentChannel,
      blocks,
    ); //this channel should be configurable, env variable or something.
    console.log(resp);
    return {
      completed: false,
    };
  };

export default postIncident;

export const blockActions = closeIncidentHandler;

export const viewSubmission = async ({ body, view, inputs, token }: any) => {
  if (view.callback_id === "close_incident_modal") {
    console.log("inside close incident modal");
    await callPostIncident(view, token, body, inputs);
  }
};
//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { closeIncidentHandler } from "../../../utils/blockActionHandlers/close-incident-button-handler.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    console.log(env);
    console.log(inputs);

    const blocks = await newIncident(<Incident> inputs);
    console.log(blocks);

    const resp = await postMessage(
      token,
      inputs.incident_channel || "C03TPA85LLE",
      blocks,
    ); //this channel should be configurable, env variable or something.
    console.log(resp);
    return {
      completed: false,
    };
  };

export default postIncident;

export const blockActions = closeIncidentHandler;

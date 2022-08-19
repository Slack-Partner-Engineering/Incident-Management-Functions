//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    console.log(env);

    const blocks = await newIncident(<Incident> inputs);

    await postMessage(token, "C03TPA85LLE", blocks); //this channel should be configurable, env variable or something.

    return await {
      outputs: {},
    };
  };

export default postIncident;

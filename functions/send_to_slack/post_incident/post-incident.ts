//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    console.log(env);

    const client = SlackAPI(token, {});
    await client.apiCall("chat.postMessage", {
      channel: "C03TPA85LLE", //this will change to an env variable or setting
      text: "New Incident",
      blocks: newIncident(<Incident> inputs),
    });
    return await {
      outputs: {},
    };
  };

export default postIncident;

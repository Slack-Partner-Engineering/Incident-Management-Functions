//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import type { postNewIncident } from "./definition.ts";

const reverse: SlackFunctionHandler<typeof postNewIncident.definition> = async (
  { inputs, token, env },
) => {
  const client = SlackAPI(token, {});
  await client.apiCall("chat.postMessage", {
    channel: "C03TPA85LLE", //this will change to an env variable or setting
    text: `
*Title*: ${inputs.short_description} \n
*Severity*: ${inputs.severity} \n
*Description*: ${inputs.long_description} \n
*Incident Participants*: ${inputs.incident_participants} \n
*Incident DRI*: ${inputs.incident_dri} \n
*Incident Triggered From*:  ${inputs.incident_trigger}
    `,
  });
  return await {
    outputs: {},
  };
};

export default reverse;

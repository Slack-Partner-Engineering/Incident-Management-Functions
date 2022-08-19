//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { createIncident } from "./definition.ts";
import { newIncident } from "./../../../views/new-incident.ts";
import type { Incident } from "./../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";

const create_incident: SlackFunctionHandler<typeof createIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    console.log(inputs, token, env);
    console.log(inputs.currentUser);

    //call to database to get incident # and increment
    //call to database to save incident
    //call to database to save audit

    const blocks = await newIncident(<Incident> inputs);

    await postMessage(token, <string> inputs.incident_channel, blocks);

    return await {
      outputs: {},
    };
  };

export default create_incident;

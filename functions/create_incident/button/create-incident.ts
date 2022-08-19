//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
// deno-lint-ignore-file import-prefix-missing

import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { createIncident } from "./definition.ts";
import { newIncident } from "./../../../views/new-incident.ts";
import type { Incident } from "./../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { saveNewIncident } from "../../../utils/database/create-incident.ts";
import { closeIncidentHandler } from "../../../utils/blockActionHandlers/close-incident-button-handler.ts";

import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";

const create_incident: SlackFunctionHandler<typeof createIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    console.log(inputs, token, env);
    console.log(inputs.currentUser);

    const incident = <Incident> inputs;
    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    const blocks = await newIncident(incident);

    await postMessage(token, <string> inputs.incident_channel, blocks);

    return {
      completed: false,
    };
  };

export default create_incident;

export const blockActions = closeIncidentHandler;

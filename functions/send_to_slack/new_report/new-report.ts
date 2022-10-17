//This function posts the details of a new incident report in the incident channel.
//It will post an ephemeral message to the user to not spam the incident channel.
//It will provide details such as how many open incidents there are, the percentage
//of each type of incident, and the directly responsible individuals for the incident (DRI).

import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncidentReport } from "./definition.ts";
import { postEphemeralMessage } from "../../../utils/slack_apis/post-message.ts";
import { generateNewIncidentReport } from "../../../utils/report/new-incident-report.ts";
import { newIncidentReport } from "../../../views/new-incident-report.ts";

const postIncidentReport: SlackFunctionHandler<
  typeof postNewIncidentReport.definition
> = async (
  { inputs, token, env },
) => {
  const incidentChannel = env["INCIDENT_CHANNEL"];

  const incidentReport = await generateNewIncidentReport(token);

  const blocks = newIncidentReport(incidentReport);

  await postEphemeralMessage(
    token,
    incidentChannel,
    blocks,
    inputs.currentUser,
  );

  return await {
    outputs: false,
  };
};

export default postIncidentReport;

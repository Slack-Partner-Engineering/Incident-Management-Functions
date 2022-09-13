//this function should post the details of a new incident report in the incident channel.
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
    conpleted: true,
  };
};

export default postIncidentReport;

//This function should normalize the incoming data from a webhook to build the standard incident object.
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { parseWebhook } from "./definition.ts";
import type { Incident } from "../../../types/incident-object.ts";

const normalizeData: SlackFunctionHandler<typeof parseWebhook.definition> =
  async (
    { inputs, env },
  ) => {
    const payload = <Incident> inputs;

    const startTime = <string> payload.incident_start_time
      ? payload.incident_start_time
      : <string> <unknown> (Date.now() / 1000); //fix this later, slack passes seconds, date.now is milliseconds

    const incident = {
      slack_reporter: "",
      external_incident_id: payload.external_incident_id
        ? payload.external_incident_id
        : "",
      incident_start_time: startTime,
      short_description: payload.short_description
        ? payload.short_description
        : "No short description",
      long_description: payload.long_description
        ? payload.long_description
        : "There have been many reports this morning that the site is down. This is a major issue, can we get on it right away. ",
      severity: payload.severity ? payload.severity : "",
      incident_participants: "",
      incident_dri: "",
      incident_trigger: "External Service (PagerDuty - AWS Cloudwatch)",
      incident_id: "",
      incident_status: "OPEN",
      incident_channel: env["INCIDENT_CHANNEL"],
    };

    //call to database to save incident and assign incident id
    // incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    //incident now has a incident number
    return await {
      outputs: incident,
    };
  };

export default normalizeData;

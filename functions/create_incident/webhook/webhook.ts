//This function should normalize the incoming data from a webhook to build the standard incident object.
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { parseWebhook } from "./definition.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { saveNewIncident } from "../../../utils/database/create-incident.ts";

const normalizeData: SlackFunctionHandler<typeof parseWebhook.definition> =
  async (
    { inputs, token },
  ) => {
    const payload = <Incident> inputs;

    const incident = {
      slack_reporter: "",
      external_incident_id: payload.external_incident_id
        ? payload.external_incident_id
        : "",
      incident_start_time: payload.incident_start_time
        ? payload.incident_start_time
        : JSON.stringify(Date.now()),
      short_description: payload.short_description
        ? payload.short_description
        : "No short description",
      long_description: payload.long_description
        ? payload.long_description
        : "No long description",
      severity: payload.severity ? payload.severity : "",
      incident_participants: "",
      incident_dri: "",
      incident_trigger: "an External Service (PagerDuty)",
      incident_id: "",
    };

    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    //incident now has a incident number
    return await {
      outputs: incident,
    };
  };

export default normalizeData;

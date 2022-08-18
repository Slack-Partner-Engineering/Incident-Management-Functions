//This function should normalize the incoming data from a webhook to build the standard incident object.
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { parseWebhook } from "./definition.ts";
import type { Incident } from "../../types/incident-object.ts";

const normalizeData: SlackFunctionHandler<typeof parseWebhook.definition> =
  async (
    { inputs, token },
  ) => {
    console.log(inputs);
    console.log(token);

    const payload = <Incident> inputs;

    console.log(payload.severity);

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
      incident_trigger: "an External Service",
    };

    console.log(incident);

    return await {
      outputs: incident,
    };
  };

export default normalizeData;

// Sample API call
// { "body": "{\n\t\"short_description\": \"Service Down!\",\n\t\"long_description\": \"Multiple reports that service is down this morning\",\n\t\"severity\": \"High\"\n}"
// }

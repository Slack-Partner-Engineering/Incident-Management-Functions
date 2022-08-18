//This function should normalize the incoming data from a webhook to build the standard incident object.
//input, a string containing JSON (for now this will be refactored when we can figure out how to make this work in hermes sending in actual JSON values)
//output, the standard incident object
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { parseWebhook } from "./definition.ts";

const normalizeData: SlackFunctionHandler<typeof parseWebhook.definition> =
  async (
    { inputs, token },
  ) => {
    console.log(inputs);
    console.log(token);

    const payload = JSON.parse(inputs.body);
    console.log(payload);

    const incident = {
      slack_reporter: "",
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

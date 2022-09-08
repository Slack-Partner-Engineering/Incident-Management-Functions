// deno-lint-ignore-file no-explicit-any
import type { Incident } from "../../../types/incident-object.ts";
import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

export async function createIssue(env: any, incident: Incident) {
  console.log("create issue called");
  console.log(incident);
  const projectKey = env["JIRA_PROJECT"];
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuthJira(env);
  const issueURL = "/rest/api/2/issue/";

  const url = "https://" + instance + issueURL;

  //build the requestBody with our inputs from the UI
  const requestBody: any = {
    "fields": {
      "project": {
        "key": projectKey,
      },
      "summary": incident.short_description,
      "description": "",
      "issuetype": {
        "name": "Task",
      },
    },
  };

  //only add optional fields to request body if they were filled in in the UI
  if (incident.long_description !== "") {
    requestBody.fields.description = incident.long_description;
  }

  const createTicketResp: any = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );
  const createTicketJson = await createTicketResp.json();
  return createTicketJson;
}

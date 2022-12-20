//This function will make a call to Jira Cloud to create an issue
//input: env, and the standard incident object
//output: API call response to /issue

import type { Incident } from "../../../../types/incident-object.ts";
import { getBasicAuthAtlassian } from "../../auth/getBasicAuthAtlassian.ts";

export async function createJiraIssue(env: any, incident: Incident) {
  const projectKey = env["JIRA_PROJECT"];
  const instance = env["ATLASSIAN_INSTANCE"];
  const basicAuth = await getBasicAuthAtlassian(env);
  const issueURL = "/rest/api/2/issue/";

  const url = "https://" + instance + issueURL;
  const incidentID = incident.incident_id;

  //build the requestBody with our inputs from the UI
  const requestBody: any = {
    "fields": {
      "project": {
        "key": projectKey,
      },
      "summary": incidentID + ": " + incident.short_description,
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

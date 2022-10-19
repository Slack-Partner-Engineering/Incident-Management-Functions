//This function will make a call to Jira Cloud to update an issue. In our current
//implementation, we just edit the summary and the description using this API call, since
//updates are posted as comments.
//input: env, and the standard incident object
//output: API call response to /issue

import type { Incident } from "../../../types/incident-object.ts";
import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

export async function updateJiraIssue(
  env: any,
  incident: Incident,
  newSummary: string,
  newLongDesc: string,
) {
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuthJira(env);
  const jiraIssueKey = incident.incident_jira_issue_key;
  const issueURL = "/rest/api/2/issue/" + jiraIssueKey;

  const url = "https://" + instance + issueURL;
  const incidentID = incident.incident_id;

  //build the requestBody with our inputs from the UI
  const requestBody: any = {
    "fields": {},
  };

  //only add optional fields to request body if they were filled in in the UI
  if (newLongDesc !== "") {
    requestBody.fields.description = newLongDesc;
  }

  if (newSummary !== "") {
    requestBody.fields.summary = incidentID + ": " + newSummary;
  }
  console.log(requestBody);

  const updateTicketResp: any = await fetch(
    url,
    {
      method: "PUT",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  return updateTicketResp;
}

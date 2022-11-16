//This function will set the priority on Jira to "Low" after an incident is closed
//input: env, and the key of the issue to set to "Low" priority
//output: API call response from PUT /issue
//@see https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/?_ga=2.226925854.2030217466.1525875113-593458345.1525875113#api/2/issue-editIssue

import { getBasicAuthAtlassian } from "../../auth/getBasicAuthAtlassian.ts";

export async function updateJiraPriorityToLow(env: any, issueKey: string) {
  console.log("updateStatus issue called");
  const instance = env["ATLASSIAN_INSTANCE"];
  const basicAuth = await getBasicAuthAtlassian(env);
  const issueURL = "/rest/api/2/issue/";

  // URL to update an Issue via Jira Cloud API
  const url = "https://" + instance + issueURL + issueKey;

  // Current Mapping for Jira Cloud Priorities
  //     "name": "Highest",
  //     "id": "1"
  //     "name": "High",
  //     "id": "2"
  //     "name": "Medium",
  //     "id": "3"
  //     "name": "Low",
  //     "id": "4"
  //     "name": "Lowest",
  //     "id": "5"
  // Automatically set any priority to "Low" once we call close incident

  const requestBody: any = await JSON.stringify({
    "update": { "priority": [{ "set": { "id": "4" } }] },
  });

  const updateJiraPriorityResp = await fetch(
    url,
    {
      method: "PUT",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: requestBody,
    },
  );

  return updateJiraPriorityResp;
}

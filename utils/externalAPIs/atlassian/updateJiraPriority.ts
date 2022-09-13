// deno-lint-ignore-file no-explicit-any
import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

/** This function lets a user in Slack update the priority of an issue
 * @see https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/?_ga=2.226925854.2030217466.1525875113-593458345.1525875113#api/2/issue-editIssue
 */
export async function updateJiraPriorityToLow(env: any, issueKey: string) {
  console.log("updateStatus issue called");
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuthJira(env);
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
  console.log("requestBody for updatepriority");
  console.log(requestBody);

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
  console.log("updateJiraPriorityResp: ");
  console.log(updateJiraPriorityResp);

  return updateJiraPriorityResp;
}

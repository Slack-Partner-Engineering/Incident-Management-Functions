// deno-lint-ignore-file no-explicit-any
import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

/** This function lets a user in Slack update the priority of an issue
 * @see https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/?_ga=2.226925854.2030217466.1525875113-593458345.1525875113#api/2/issue-editIssue
 */
export async function getJiraPriority(env: any, issueKey: any) {
  console.log("updateStatus issue called");
  const instance = env["JIRA_INSTANCE"];
  console.log(instance);
  const basicAuth = await getBasicAuthJira(env);
  const issueURL = "/rest/api/2/issue/";

  // URL to update an Issue via Jira Cloud API
  const url = "https://" + instance + issueURL + issueKey;

  const getTicketResp: any = await fetch(
    url,
    {
      method: "GET",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
    },
  );
  // .then((getTicketResp) => getTicketResp.json());
  console.log("getTicketResp: ");
  const getTicketJson = await getTicketResp.json();
  console.log(getTicketJson);
  const currentIssuePriority = getTicketJson.fields.priority.id;

  return currentIssuePriority;
}

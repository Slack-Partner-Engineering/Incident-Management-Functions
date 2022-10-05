import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

/** This function lets a user in Slack update the priority of an issue
 * @see https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/?_ga=2.226925854.2030217466.1525875113-593458345.1525875113#api/2/issue-editIssue
 */
export async function decreaseJiraPriority(env: any, issueKey: any) {
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

  const getTicketJson = await getTicketResp.json();
  let currentIssuePriority = <number> getTicketJson.fields.priority.id;
  currentIssuePriority;
  console.log("currentIssuePriority: ");
  console.log(typeof (currentIssuePriority));
  if (currentIssuePriority >= 5) {
    console.log(
      "Cannot de escalate this any further since it is at the lowest priority",
    );
  } else {
    currentIssuePriority += 1;
  }

  const requestBody: any = JSON.stringify({
    "update": {
      "priority": [{ "set": { "id": `${currentIssuePriority}` } }],
    },
  });

  const increaseJiraPriorityResp = await fetch(
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
  // console.log("increaseJiraPriorityResp: ");
  console.log(increaseJiraPriorityResp);

  return increaseJiraPriorityResp;
}

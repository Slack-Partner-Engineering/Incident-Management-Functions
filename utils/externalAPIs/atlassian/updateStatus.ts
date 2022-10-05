import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

/** This function lets a user in Slack update the status of an issue
 * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-add-comment-8946422/
 */
export async function updateStatus(env: any, issueKey: string) {
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuthJira(env);
  const issueURL = "/rest/api/2/issue/";

  // API call to transition
  const url = "https://" + instance + issueURL + issueKey + "/transitions";
  // // const link = "https://" + instance + "/browse/" + issueKey;

  //41 is the internal Jira code for moving the status to "Done"
  const requestBody: any = await JSON.stringify({
    "transition": {
      "id": "41",
    },
  });

  const updateStatusResp = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: requestBody,
    },
  )
    .then((updateStatusResp) => updateStatusResp.toString());

  return updateStatusResp;
}

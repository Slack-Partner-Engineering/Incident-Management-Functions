// deno-lint-ignore-file no-explicit-any
import { getBasicAuth } from "../../auth/getBasicAuth.ts";

/** This function lets a user in Slack update the status of an issue
 * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-add-comment-8946422/
 */
export async function updateStatus(env: any, issueKey: string) {
  console.log("updateStatus issue called");
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuth(env);
  const issueURL = "/rest/api/2/issue/";

  console.log("issueKey");
  console.log(issueKey);

  // API call to transition
  const url = "https://" + instance + issueURL + issueKey + "/transitions";
  console.log("url: ");
  console.log(url);
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
  console.log("updateStatusResp: ");
  console.log(updateStatusResp);

  return updateStatusResp;
}

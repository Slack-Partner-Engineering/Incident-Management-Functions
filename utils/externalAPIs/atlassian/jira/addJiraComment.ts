//This function will make a call to Jira Cloud to add a comment to a specific issue
//input: env, jiraIssueKey, closeNotes
//output: API call response to /comment

import { getBasicAuthAtlassian } from "../../auth/getBasicAuthAtlassian.ts";

export async function addJiraComment(
  env: any,
  jiraIssueKey: string,
  closeNotes: string,
) {
  const instance = env["ATLASSIAN_INSTANCE"];
  const basicAuth = await getBasicAuthAtlassian(env);
  const issueURL = "/rest/api/2/issue/";

  const url = "https://" + instance + issueURL + jiraIssueKey + "/comment";

  const requestBody: any = {
    "body": closeNotes,
  };

  const addCommentResp: any = await fetch(
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
  return addCommentResp;
}

import { getBasicAuthJira } from "../../auth/getBasicAuthJira.ts";

export async function addJiraComment(
  env: any,
  jiraIssueKey: string,
  closeNotes: string,
) {
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuthJira(env);
  const issueURL = "/rest/api/2/issue/";

  const url = "https://" + instance + issueURL + jiraIssueKey + "/comment";

  const requestBody: any = {
    "body": "Closing incident with the following close notes: " + closeNotes,
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
  // const addCommentRespJson = await addCommentResp.json();
  return addCommentResp;
}

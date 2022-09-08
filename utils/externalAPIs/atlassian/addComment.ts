// deno-lint-ignore-file no-explicit-any
import { getBasicAuth } from "../../auth/getBasicAuth.ts";

export async function addComment(
  env: any,
  incidentKey: string,
  closeNotes: string,
) {
  const instance = env["JIRA_INSTANCE"];
  const basicAuth = await getBasicAuth(env);
  const issueURL = "/rest/api/2/issue/";

  const url = "https://" + instance + issueURL + incidentKey + "/comment";

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
  const addCommentRespJson = await addCommentResp.json();
  return addCommentRespJson;
}

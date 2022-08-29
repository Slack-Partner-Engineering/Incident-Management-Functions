// deno-lint-ignore-file no-explicit-any
//This function exports the auth string needed for basic auth for Jira Cloud
export async function getBasicAuth(env: any) {
  //needed for auth,
  const username = env["JIRA_USERNAME"];
  const password = env["JIRA_API_KEY"];
  const basicAuth = await "Basic " + btoa(username + ":" + password);
  return basicAuth;
}

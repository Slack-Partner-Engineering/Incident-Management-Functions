//This function exports the auth string needed for basic auth for Jira Cloud

export async function getBasicAuthJira(env: any) {
  //needed for auth
  const username = env["JIRA_USERNAME"];
  const password = env["JIRA_API_KEY"];
  const basicAuth = await "Basic " + btoa(username + ":" + password);
  return basicAuth;
}

//This function exports the auth string needed for basic auth for Atlassian Cloud

export async function getBasicAuthAtlassian(env: any) {
  //needed for auth
  const username = env["ATLASSIAN_USERNAME"];
  const password = env["ATLASSIAN_API_KEY"];
  const basicAuth = await "Basic " + btoa(username + ":" + password);
  return basicAuth;
}

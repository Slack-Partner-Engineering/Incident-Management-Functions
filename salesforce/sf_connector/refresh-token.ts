import { storeSalesforceAuth } from "../../utils/database/store-salesforce-auth.ts";

const refreshSfToken = async (env: any, slackToken: string) => {
  //await refreshToken(incidentInfo, env, true);
  const client_id = env["SALESFORCE_CLIENT_ID"];
  const client_secret = env["SALESFORCE_CLIENT_SECRET"];
  const refresh_token = env["SALESFORCE_REFRESH_TOKEN"];
  const refreshURL =
    `https://login.salesforce.com/services/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`;

  const refreshResponse: any = await fetch(refreshURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await refreshResponse.json();

  //store the new token
  await storeSalesforceAuth(
    env["SALESFORCE_ORG_ID"],
    res.access_token,
    env["SALESFORCE_REFRESH_TOKEN"],
    slackToken,
  );
  const refreshedAuth = `Bearer ${res.access_token}`;
  return refreshedAuth;
};

export { refreshSfToken };

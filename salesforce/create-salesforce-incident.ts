import { Incident } from "../types/incident-object.ts";
import { getSfAuth } from "../utils/database/get-salesforce-auth.ts";
import { storeSalesforceAuth } from "../utils/database/store-salesforce-auth.ts";

let refreshedToken = "";

const createSalesforceIncident = async (
  incidentInfo: Incident,
  env: any,
  token: string,
) => {
  const url = `${
    env["SALESFORCE_INSTANCE_URL"]
  }/services/data/v55.0/sobjects/incident__c`;

  const body: any = {
    Name: `${
      incidentInfo.external_incident_id
        ? incidentInfo.incident_trigger
        : "Reported Internally in Slack"
    }`,
    Incident_Number__c: incidentInfo.incident_id,
    Summary__c: incidentInfo.short_description,
    Severity__c: incidentInfo.severity,
  };

  let auth;
  const sfAuth = await getSfAuth(token, env["SALESFORCE_ORG_ID"]);

  if (sfAuth) {
    auth = `Bearer ${sfAuth.access_token}`;
  } else {
    auth = `Bearer ${env["ACCESS_TOKEN"]}`;
  }
  const sfResponse: any = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const res = await sfResponse.json();

  //if the token is expired
  if (res[0]) {
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
      token,
    );
    refreshedToken = res.access_token;
    const refreshedAuth = `Bearer ${refreshedToken}`;

    //make the api call again with the new token
    const sfResponse: any = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Authorization": refreshedAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    const refreshTokenResponse = await sfResponse.json();
    const incidentURL = `${
      env["SALESFORCE_INSTANCE_URL"] + "/" + refreshTokenResponse.id
    }`;
    return {
      incidentURL: incidentURL,
      incidentId: refreshTokenResponse.id,
    };
  } else {
    const incidentURL = `${env["SALESFORCE_INSTANCE_URL"] + "/" + res.id}`;
    return {
      incidentURL: incidentURL,
      incidentId: res.id,
    };
  }
};

export { createSalesforceIncident };

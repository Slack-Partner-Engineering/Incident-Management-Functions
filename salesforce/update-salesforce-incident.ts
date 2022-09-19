import { Incident } from "../types/incident-object.ts";
import { getSfAuth } from "../utils/database/get-salesforce-auth.ts";
import { storeSalesforceAuth } from "../utils/database/store-salesforce-auth.ts";

let refreshedToken = "";

const updateSalesforceIncident = async (
  incidentInfo: Incident,
  env: any,
  token: string,
) => {
  const url = `${
    env["SALESFORCE_INSTANCE_URL"]
  }/services/data/v55.0/sobjects/incident__c/${incidentInfo.salesforce_incident_id}`;

  const body: any = {
    Name: `${
      incidentInfo.external_incident_id
        ? incidentInfo.incident_trigger
        : "Reported Internally in Slack"
    }`,
    Incident_Number__c: incidentInfo.incident_id,
    Summary__c: incidentInfo.short_description,
    Severity__c: incidentInfo.severity.substring(0, 250),
  };
  console.log(
    incidentInfo.severity + " is what is shown in the save salesforce method",
  );

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
      method: "PATCH",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const res = await sfResponse.ok;
  console.log(res);

  //if the token is expired
  if (!sfResponse.ok) {
    console.log("call failed");

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
        method: "PATCH",
        headers: {
          "Authorization": refreshedAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    await sfResponse.json();
    return {};
  } else {
    const incidentURL = `${env["SALESFORCE_INSTANCE_URL"] + "/" + res.id}`;
    return {
      incidentURL: incidentURL,
      incidentId: res.id,
    };
  }
};

export { updateSalesforceIncident };

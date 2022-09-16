import { Incident } from "../types/incident-object.ts";

let refreshedToken = "";

const updateSalesforceIncident = async (
  incidentInfo: Incident,
  env: any,
  refresh: boolean,
) => {
  console.log(incidentInfo);

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
    Severity__c: incidentInfo.severity,
  };

  let auth = "";
  if (refresh === false) {
    auth = `Bearer ${env["ACCESS_TOKEN"]}`;
  } else {
    auth = `Bearer ${refreshedToken}`;
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
  const res = await sfResponse.json();

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
    refreshedToken = res.access_token;
    auth = `Bearer ${refreshedToken}`;
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
    const refreshTokenResponse = await sfResponse.json();
    const incidentURL = `${
      env["SALESFORCE_INSTANCE_URL"] + "/" + refreshTokenResponse.id
    }`;
    console.log(refreshedToken);

    return incidentURL;
  } else {
    const incidentURL = `${env["SALESFORCE_INSTANCE_URL"] + "/" + res.id}`;
    return {
      incidentURL: incidentURL,
      incidentId: res.id,
    };
  }
};
// const refreshToken = async (incident: Incident, env: any, refresh: boolean) => {
//   const client_id = env["SALESFORCE_CLIENT_ID"];
//   const client_secret = env["SALESFORCE_CLIENT_SECRET"];
//   const refresh_token = env["SALESFORCE_REFRESH_TOKEN"];
//   const refreshURL =
//     `https://login.salesforce.com/services/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}`;

//   console.log(refreshURL);

//   const refreshResponse: any = await fetch(refreshURL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   console.log(refreshResponse);
//   const res = await refreshResponse.json();
//   console.log(res);
//   refreshedToken = res.access_token;
//   await createSalesforceIncident(incident, env, refresh);
// };

export { updateSalesforceIncident };

// POST /services/oauth2/token HTTP/1.1
// Host: login.salesforce.com
// Authorization:  Basic
// client_id=3MVG9lKcPoNINVBIPJjdw1J9LLM82HnFVVX19KY1uA5mu0QqEWhqKpoW3svG3XHrXDiCQjK1mdgAvhCscA9GE&
// client_secret=1955279925675241571
// grant_type=refresh_token&
// refresh_token=your token here
//https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_refresh_token_flow.htm&type=5

// curl https://MyDomainName.my.salesforce.com/services/data/v56.0/sobjects/Account/ -H
//"Authorization: Bearer token" -H "Content-Type: application/json" -d "@newaccount.json"

// // Single record creation
// await conn.sobject("incident__c").create(
//   {
//     Name: "Slack Created - {source}",
//     Incident_Number__c: "INC-4423534423",
//     Summary__c: "short description",
//     Severity__c: "CRITICAL",
//   },
//   await function (err: any, ret: any) {
//     if (err || !ret.success) {
//       return console.error(err, ret);
//     }
//     console.log("Created record id : " + ret.id);
//     console.log(
//       `Object URL ${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
//     );
//     result = {
//       "status": "sucess",
//       url: `${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
//       "message": "incident Created!",
//     };
//     return result.url;
//   },
// );

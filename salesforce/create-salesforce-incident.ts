import jsforce from "https://esm.sh/jsforce";
import { config } from "https://esm.sh/dotenv@16.0.2";
config();

const createSalesforceIncident = async (incidentInfo: any, env: any) => {
  console.log(incidentInfo);

  let result;

  const conn = new jsforce.Connection({
    oauth2: {
      clientId: env["SALESFORCE_CLIENT_ID"],
      clientSecret: env["SALESFORCE_CLIENT_SECRET"],
      redirectUri: env["SALESFORCE_REDIRECT_URL"],
    },
    instanceUrl: env["SALESFORCE_INSTANCE_URL"],
    accessToken: env["SALESFORCE_ACCESS_TOKEN"],
    refreshToken: env["SALESFORCE_REFRESH_TOKEN"],
  });

  conn.oauth2.refreshToken(
    env["SALESFORCE_REFRESH_TOKEN"],
    (err, results) => {
      if (err) return (err);
      console.log(results);
    },
  );

  // Single record creation
  await conn.sobject("incident__c").create(
    {
      Name: "Slack Created - {source}",
      Incident_Number__c: "INC-4423534423",
      Summary__c: "short description",
      Severity__c: "CRITICAL",
    },
    await function (err: any, ret: any) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      console.log("Created record id : " + ret.id);
      console.log(
        `Object URL ${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
      );
      result = {
        "status": "sucess",
        url: `${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
        "message": "incident Created!",
      };
    },
  );
  return result;
};

export { createSalesforceIncident };

import { Incident } from "../types/incident-object.ts";
import { createNewSFRecord } from "./sf_connector/post-rest-api.ts";

const createSalesforceIncident = async (
  incidentInfo: Incident,
  env: any,
  token: string,
) => {
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

  return await createNewSFRecord(body, env, token, "incident__c");
};

export { createSalesforceIncident };

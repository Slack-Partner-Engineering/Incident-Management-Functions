import { Incident } from "../types/incident-object.ts";
import { updateSfRecord } from "./sf_connector/patch-rest-api.ts";
const updateSalesforceIncident = async (
  incidentInfo: Incident,
  env: any,
  token: string,
) => {
  const body: any = {
    Status_Update__c: incidentInfo.last_incident_update,
    Name: `${
      incidentInfo.external_incident_id
        ? incidentInfo.incident_trigger
        : "Reported Internally in Slack"
    }`,
    Incident_Number__c: incidentInfo.incident_id,
    Summary__c: incidentInfo.short_description,
    Severity__c: incidentInfo.severity.substring(0, 250),
  };

  return await updateSfRecord(
    body,
    env,
    token,
    "incident__c",
    incidentInfo.salesforce_incident_id,
  );
};

export { updateSalesforceIncident };

import { Incident } from "../types/incident-object.ts";
import { updateSfRecord } from "./sf_connector/patch-rest-api.ts";

const closeSalesforceIncident = async (
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
    Incident_Open__c: "RESOLVED",
    Resolution_Notes__c: incidentInfo.incident_close_notes,
  };
  return await updateSfRecord(
    body,
    env,
    token,
    "incident__c",
    incidentInfo.salesforce_incident_id,
  );
};

export { closeSalesforceIncident };

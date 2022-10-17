import type { Incident } from "../../types/incident-object.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

const saveAuditRecord = async (token: string, incident: Incident) => {
  const client = SlackAPI(token, {});

  const incident_id_and_timestamp: string = incident.incident_id + "-" +
    Date.now(); //build in incident increment logic or something here

  const response = await client.apps.datastore.put(
    {
      datastore: "AuditIncidents",
      item: {
        incident_id_and_timestamp: incident_id_and_timestamp,
        incident_object: JSON.stringify(incident),
      },
    },
  );

  if (!response.ok) {
    console.log("Error calling apps.datastore.put:");
    return {
      error: response.error,
    };
  } else {
    console.log("Datastore put successful!");
    return response.item;
  }
};

export { saveAuditRecord };

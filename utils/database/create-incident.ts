import type { Incident } from "../../types/incident-object.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { saveAuditRecord } from "./save-audit.ts";

const saveNewIncident = async (token: string, incident: Incident) => {
  const client = SlackAPI(token, {});

  incident.incident_id = "INC-" + (Date.now()); //build in incident increment logic or something here at some point. Pull prefix from env and starting number maybe

  await saveAuditRecord(token, incident);

  const response = await client.apps.datastore.put(
    {
      datastore: "Incidents",
      item: incident,
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

export { saveNewIncident };

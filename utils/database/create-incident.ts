import type { Incident } from "../../types/incident-object.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { saveAuditRecord } from "./save-audit.ts";

const saveNewIncident = async (token: string, incident: Incident) => {
  const client = SlackAPI(token, {});

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

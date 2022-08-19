import type { Incident } from "../../types/incident-object.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

const saveNewIncident = async (token: string, incident: Incident) => {
  const client = SlackAPI(token, {});

  incident.incident_id = "INC-" + (Date.now()); //build in incident increment logic or something here

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

//call to database to save audit

export { saveNewIncident };

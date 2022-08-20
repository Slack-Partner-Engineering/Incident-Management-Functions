import type { Incident } from "../../types/incident-object.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

const getIncident = async (token: string, incident: Incident) => {
  const client = SlackAPI(token, {});

  try {
    const response = await client.apiCall("apps.datastore.get", {
      datastore: "Incidents",
      id: incident.incident_id,
    });

    if (!response.ok) {
      console.log("Error calling apps.datastore.get:");
      return {
        error: response.error,
      };
    } else {
      console.log("Datastore get success!");
      return response.item;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { getIncident };

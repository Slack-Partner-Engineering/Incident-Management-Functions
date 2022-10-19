import { SlackAPI } from "deno-slack-api/mod.ts";

const getIncident = async (token: string, incident_id: string) => {
  const client = SlackAPI(token, {});

  try {
    const response = await client.apiCall("apps.datastore.get", {
      datastore: "Incidents",
      id: incident_id,
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

const getIncidents = async (token: string) => {
  const client = SlackAPI(token, {});

  try {
    const response = await client.apiCall("apps.datastore.query", {
      datastore: "Incidents",
      expression: "",
      limit: 1000,
    });

    if (!response.ok) {
      console.log("Error calling apps.datastore.query:");
      return {
        error: response.error,
      };
    } else {
      console.log("Datastore query success!");
      return response;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { getIncident, getIncidents };

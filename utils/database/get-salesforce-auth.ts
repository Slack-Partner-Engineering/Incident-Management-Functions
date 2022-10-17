import { SlackAPI } from "deno-slack-api/mod.ts";

const getSfAuth = async (token: string, salesforce_org_id: string) => {
  const client = SlackAPI(token, {});

  try {
    const response = await client.apiCall("apps.datastore.get", {
      datastore: "SalesforceAuth",
      id: salesforce_org_id,
    });

    if (!response.ok) {
      console.log("Error calling apps.datastore.get: salesforce auth");
      return {
        error: response.error,
      };
    } else {
      console.log("Datastore get success! from sfauth database");
      return response.item;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { getSfAuth };

import { SlackAPI } from "deno-slack-api/mod.ts";

const storeSalesforceAuth = async (
  salesforce_org_id: string,
  access_token: string,
  refresh_token: string,
  token: string,
) => {
  const client = SlackAPI(token, {});

  const date_time_access_token_issued = Date.now();

  const response = await client.apps.datastore.put(
    {
      datastore: "salesforceAuth",
      item: {
        salesforce_org_id: salesforce_org_id,
        access_token: access_token,
        refresh_token: refresh_token,
        date_time_access_token_issued: date_time_access_token_issued,
      },
    },
  );

  if (!response.ok) {
    console.log("Error calling apps.datastore.put from store sf creds");
    console.log(response);

    return {
      error: response.error,
    };
  } else {
    console.log("Datastore put successful! from store sf creds");
    return response.item;
  }
};

export { storeSalesforceAuth };

//Create a new Salesforce object record.

import { getSfAuth } from "../../utils/database/get-salesforce-auth.ts";
import { getObjectURL } from "./build-object-url.ts";
import { getRestURLPost } from "./build-rest-url.ts";
import { refreshSfToken } from "./refresh-token.ts";

const createNewSFRecord = async (
  record: any,
  env: any,
  token: string,
  sfObjectName: string,
) => {
  let auth;
  const sfAuth = await getSfAuth(token, env["SALESFORCE_ORG_ID"]);

  const url = getRestURLPost(sfObjectName, env);

  if (sfAuth) {
    auth = `Bearer ${sfAuth.access_token}`;
  } else {
    auth = `Bearer ${env["ACCESS_TOKEN"]}`;
  }
  const sfResponse: any = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    },
  );
  const res = await sfResponse.json();

  //if the token is expired
  if (res[0]) {
    const refreshedAuth = await refreshSfToken(env, token);

    //make the api call again with the new token
    const sfResponse: any = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Authorization": refreshedAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      },
    );
    const refreshTokenResponse = await sfResponse.json();
    const incidentURL = `${
      env["SALESFORCE_INSTANCE_URL"] + "/" + refreshTokenResponse.id
    }`;
    return {
      incidentURL: incidentURL,
      incidentId: refreshTokenResponse.id,
    };
  } else {
    const sfIncidentURL = getObjectURL(res.id, env);

    return {
      incidentURL: sfIncidentURL,
      incidentId: res.id,
    };
  }
};

export { createNewSFRecord };

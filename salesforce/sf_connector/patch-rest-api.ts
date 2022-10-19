import { getSfAuth } from "../../utils/database/get-salesforce-auth.ts";
import { getObjectURL } from "./build-object-url.ts";
import { getRestURLPatch } from "./build-rest-url.ts";
import { refreshSfToken } from "./refresh-token.ts";

const updateSfRecord = async (
  record: any,
  env: any,
  token: string,
  sfObjectName: string,
  sfRecordId: string,
) => {
  let auth;
  const sfAuth = await getSfAuth(token, env["SALESFORCE_ORG_ID"]);
  const url = getRestURLPatch(sfObjectName, env, sfRecordId);

  if (sfAuth) {
    auth = `Bearer ${sfAuth.access_token}`;
  } else {
    auth = `Bearer ${env["ACCESS_TOKEN"]}`;
  }
  const sfResponse: any = await fetch(
    url,
    {
      method: "PATCH",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    },
  );

  const res = await sfResponse.ok;

  //if the token is expired
  if (!sfResponse.ok) {
    const refreshedAuth = await refreshSfToken(env, token);

    //make the api call again with the new token
    const sfResponse: any = await fetch(
      url,
      {
        method: "PATCH",
        headers: {
          "Authorization": refreshedAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      },
    );
    await sfResponse.json();
    return {};
  } else {
    const sfIncidentURL = getObjectURL(res.id, env);

    return {
      incidentURL: sfIncidentURL,
      incidentId: res.id,
    };
  }
};

export { updateSfRecord };

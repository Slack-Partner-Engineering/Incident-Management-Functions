import { Incident } from "../../../../types/incident-object.ts";
import { getConfluenceCreateHTML } from "../../../../views/create-confluence-page.ts";
import { getBasicAuthAtlassian } from "../../auth/getBasicAuthAtlassian.ts";

export async function createConfluenceDoc(env: any, incident: Incident) {
  const instance = env["ATLASSIAN_INSTANCE"];
  const basicAuth = await getBasicAuthAtlassian(env);

  const url = "https://" + instance + "/wiki/rest/api/content";

  const documentHTML = await getConfluenceCreateHTML(incident);

  const requestBody = {
    "type": "page",
    "title": `${incident.short_description} + ${incident.incident_id}`,
    "space": { "key": env["ATLASSIAN_SPACE"] },
    "body": {
      "storage": {
        "value": documentHTML,
        "representation": "storage",
      },
    },
  };

  const createPageResp: any = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );
  const createPageJson = await createPageResp.json();
  console.log(createPageJson);

  const docURL = createPageJson._links
    ? `https://${instance}/wiki${createPageJson._links.webui}`
    : `FAILED`;

  return docURL;
}

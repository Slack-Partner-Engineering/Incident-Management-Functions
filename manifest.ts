import { Manifest } from "deno-slack-sdk/mod.ts";
import { runFromExternalWebhook } from "./workflows/incoming-webhook-incident.ts";
import { postIncidentFromButtonWF } from "./workflows/button-create-incident-wf.ts";
import { AuditIncidents, Incident } from "./datastore/definition.ts";

export default Manifest({
  name: "Incident Response Bot",
  description: "Reverse a string",
  icon: "assets/icon.png",
  workflows: [runFromExternalWebhook, postIncidentFromButtonWF],
  outgoingDomains: [],
  datastores: [Incident, AuditIncidents],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "channels:manage",
    "calls:write",
    "triggers:write",
    "bookmarks:write",
  ],
});

import { Manifest } from "deno-slack-sdk/mod.ts";
import { runFromExternalWebhook } from "./workflows/incoming-webhook-incident.ts";
import { postIncidentFromButtonWF } from "./workflows/button-create-incident-wf.ts";
import {
  AuditIncidents,
  Incident,
  SalesforceAuth,
} from "./datastore/definition.ts";
import { getIncidentReportButtonWF } from "./workflows/button-create-incident-report.ts";

export default Manifest({
  name: "Incident Response Bot",
  description: "Reverse a string",
  icon: "assets/icon.png",
  workflows: [
    runFromExternalWebhook,
    postIncidentFromButtonWF,
    getIncidentReportButtonWF,
  ],
  outgoingDomains: [],
  datastores: [Incident, AuditIncidents, SalesforceAuth],
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

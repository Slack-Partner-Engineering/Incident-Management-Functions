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
  name: "Incident Response",
  description: "Handles Incident Response",
  icon: "assets/icon.png",
  //Three main workflows for this app.
  //postIncidentFromButtonWF creates an incident manually from button click
  //runFromExternalWebhook creates an incident from an external service, automatically, via webhook.
  //getIncidentReportButtonWF posts an ephemeral message with analytics of all of the incidents stored in the DataStore.
  workflows: [
    runFromExternalWebhook,
    postIncidentFromButtonWF,
    getIncidentReportButtonWF,
  ],
  outgoingDomains: [],
  datastores: [Incident, AuditIncidents, SalesforceAuth],
  //Scopes needed for app to update datastore, create channels, create calls (Zoom), and create bookmarks
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

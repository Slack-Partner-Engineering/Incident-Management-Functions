import { Manifest } from "deno-slack-sdk/mod.ts";
import { runFromExternalWebhook } from "./workflows/incoming-webhook-incident.ts";
import { createIncidentWF } from "./workflows/button-create-incident-wf.ts";

export default Manifest({
  name: "Incident-Management-Functions",
  description: "Reverse a string",
  icon: "assets/icon.png",
  workflows: [runFromExternalWebhook, createIncidentWF],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});

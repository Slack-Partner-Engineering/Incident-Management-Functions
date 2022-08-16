import {
  DefineFunction,
  DefineWorkflow,
  Manifest,
  Schema,
} from "deno-slack-sdk/mod.ts";

import { TestReverseWorkflow } from "./workflows/reverse_wf.ts";

export default Manifest({
  name: "Incident-Management-Functions",
  description: "Reverse a string",
  icon: "assets/icon.png",
  workflows: [TestReverseWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});

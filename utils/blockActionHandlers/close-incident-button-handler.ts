import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { createIncident } from "./../../functions/create_incident/button/definition.ts";

const router = BlockActionsRouter(createIncident);

export const closeIncidentHandler = router.addHandler(
  ["close_incident"],
  async ({ action, body, token }) => {
    console.log("testing the block actions router");
  },
);
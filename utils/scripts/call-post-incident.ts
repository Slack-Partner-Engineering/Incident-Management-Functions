// deno-lint-ignore-file
// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from "deno-slack-api/mod.ts";

//call my function update_status via functions.run
//reusable so it can be used in all workflows
export async function callPostIncident(
  view: any,
  token: string,
  body: any,
  inputs: any,
) {
  console.log("view");
  console.log(view);
  console.log("body");
  console.log(body);
  console.log("inputs");
  console.log(inputs);

  const closeNotes =
    view.state.values.add_comment_block.close_incident_action.value;

  console.log(closeNotes);

  const client = SlackAPI(token, {});

  // call chat.update and update the incident status to Closed
  // call addComment to add a comment with the close notes in Atlassian
}

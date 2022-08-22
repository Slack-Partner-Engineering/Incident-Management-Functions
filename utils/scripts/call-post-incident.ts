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

  console.log("view")
  console.log(view)
  console.log("body")
  console.log(body)
  console.log("inputs")
  console.log(inputs)

  const statusValue =
    view.state.values.update_status_block.update_status_action.selected_option
      .value;
  const issueKey = view.private_metadata;

  const client = SlackAPI(token, {});

  // call chat.update and update the incident status to Closed

}

// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from 'deno-slack-api/mod.ts';

//call my function update_status via functions.run
//reusable so it can be used in all workflows
export async function callPostIncident(view: any, token: string, body: any, inputs: any) {

  const statusValue = view.state.values.update_status_block.update_status_action.selected_option.value
  const issueKey = view.private_metadata

  const client = SlackAPI(token, {});

  await client.apiCall("functions.run", {
    function_reference: body.api_app_id +
      "#/functions/postNewIncident",
    inputs: {
      issueKey: issueKey,
      status: statusValue,
      currentUser: inputs.currentUser
    },
  });

}
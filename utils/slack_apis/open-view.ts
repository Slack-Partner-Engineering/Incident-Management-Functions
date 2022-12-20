//This function will open a view for a user.
//input: token,modalView, triggger_id
//output: none
//@see https://api.slack.com/methods/views.open

import { SlackAPI } from "deno-slack-api/mod.ts";

export const openView = async (
  token: string,
  modalView: any,
  trigger_id: string,
) => {
  const client = SlackAPI(token);
  try {
    // if view is not opening, make sure to log this views.open call since it may have an error
    // even without going into the catch block
    await client.views.open({
      trigger_id: trigger_id,
      view: modalView,
    });
  } catch (error) {
    console.log(error);
  }
};

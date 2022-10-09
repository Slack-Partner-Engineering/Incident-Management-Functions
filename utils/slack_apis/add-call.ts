//This function will add a Call block to make your call more interactive.
//Whenever someone starts or shares a call, it will appear in Slack with
//a list of participants, a join button, and information about the call.
//input: token, channel, title, type, link, emoji
//output: API call response to /calls.add
//@see https://api.slack.com/methods/calls.add

import { SlackAPI } from "deno-slack-api/mod.ts";

export const addCall = async (
  join_url: string,
  external_unique_id: number,
  token: string,
) => {
  const client = SlackAPI(token);

  try {
    const res = await client.calls.add({
      join_url: join_url,
      external_unique_id: external_unique_id,
      token: token,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

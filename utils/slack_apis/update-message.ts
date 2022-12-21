//This function will update the message once an incident is updated. For example,
//when escalate or de-escalate, add a new DRI, the incident object needs to be changed.
//This is the function used to update the incident object.
//input: token, channel, ts, blocks
//output: response to API call /chat.update
//@see https://api.slack.com/methods/chat.update

import { SlackAPI } from "deno-slack-api/mod.ts";

export const updateMessage = async (
  token: string,
  channel: string,
  ts: any,
  blocks: any,
) => {
  const client = SlackAPI(token, {});

  try {
    const resp = await client.apiCall("chat.update", {
      channel: channel,
      ts: ts,
      blocks: blocks,
    });
    return resp;
  } catch (error) {
    return error;
  }
};

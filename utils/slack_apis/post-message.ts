//The functions below will post a regular message.
//input: token,channel, blocks
//output: response to chat.postMessage API call
//@see https://api.slack.com/methods/chat.postMessage

import { SlackAPI } from "deno-slack-api/mod.ts";

export async function postMessage(
  token: string,
  channel: string,
  blocks: any,
) {
  const client = SlackAPI(token, {});

  const resp = await client.apiCall("chat.postMessage", {
    channel: channel,
    blocks: blocks,
    unfurl_links: true, //doesn't work, bug in hermes?
  });
  return resp;
}

//The functions below will post a thread reply.
//input: token, channel, blocks, thread_ts of original message to reply to
//output: response to chat.postMessage API call
//@see https://api.slack.com/methods/chat.postMessage
export async function postReply(
  token: string,
  channel: string,
  blocks: any,
  thread_ts: any,
) {
  const client = SlackAPI(token, {});

  const resp = await client.apiCall("chat.postMessage", {
    channel: channel,
    blocks: blocks,
    unfurl_links: false,
    thread_ts: thread_ts,
  });
  return resp;
}

//The functions below will post an ephemeral message.
//input: token, channel, blocks, user_id of the user to post the message to.
//output: response to chat.postMessage API call
//@see https://api.slack.com/methods/chat.postEphemeral
export async function postEphemeralMessage(
  token: string,
  channel_id: string,
  blocks: any,
  user_id: string,
) {
  const client = SlackAPI(token, {});

  const resp = await client.apiCall("chat.postEphemeral", {
    channel: channel_id,
    blocks: blocks,
    token: token,
    user: user_id,
  });
  return resp;
}

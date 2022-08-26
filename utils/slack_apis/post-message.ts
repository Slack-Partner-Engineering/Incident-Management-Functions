// deno-lint-ignore-file no-explicit-any
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
    unfurl_links: false,
  });
  return resp;
}

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

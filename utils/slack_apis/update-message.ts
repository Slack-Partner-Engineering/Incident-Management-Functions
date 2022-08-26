// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from "deno-slack-api/mod.ts";

export async function updateMessage(
  token: string,
  channel: string,
  ts: any,
) {
  const client = SlackAPI(token, {});

  const resp = await client.apiCall("chat.update", {
    channel: channel,
    ts: ts,
  });
  return resp;
}

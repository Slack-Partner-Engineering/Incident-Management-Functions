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

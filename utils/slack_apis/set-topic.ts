import { SlackAPI } from "deno-slack-api/mod.ts";

export const setTopic = async (
  token: string,
  channel_id: string,
  text: any,
) => {
  const client = SlackAPI(token, {});

  try {
    const resp = await client.apiCall("conversations.setTopic", {
      token: token,
      channel: channel_id,
      topic: text,
    });
    return resp;
  } catch (error) {
    return error;
  }
};

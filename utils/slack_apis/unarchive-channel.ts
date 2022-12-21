import { SlackAPI } from "deno-slack-api/mod.ts";

export const unarchiveChannel = async (
  token: string,
  channelID: string,
) => {
  const client = SlackAPI(token, {});

  try {
    const resp = await client.apiCall("conversations.unarchive", {
      channel: channelID,
    });
    return resp;
  } catch (error) {
    console.log(error);
    return (error);
  }
};

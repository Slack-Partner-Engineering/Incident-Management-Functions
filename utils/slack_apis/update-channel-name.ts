//This function will set the topic of a channel. It is used to set the topic of
//the swarming channel once the channel is created.
//input: token, channel_id, text
//output: response to API call /conversations.setTopic
//@see https://api.slack.com/methods/conversations.setTopic

import { SlackAPI } from "deno-slack-api/mod.ts";

export const updateChannelName = async (
  token: string,
  channel_id: string,
  newChannelName: any,
) => {
  const client = SlackAPI(token, {});

  try {
    const resp = await client.apiCall("conversations.rename", {
      token: token,
      channel: channel_id,
      name: newChannelName,
    });
    return resp;
  } catch (error) {
    return error;
  }
};

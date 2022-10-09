//This function will enable a user to join a channel. We use this function to
//invite all of the incident participants in the swarming channel.
//input: user_id, channel_id, token
//output: none
//@see https://api.slack.com/methods/conversations.invite

import { SlackAPI } from "deno-slack-api/mod.ts";

export const inviteUserToChannel = async (
  user_id: string,
  channel_id: string,
  token: string,
) => {
  const client = SlackAPI(token);

  try {
    await client.conversations.invite({
      token: token,
      channel: channel_id,
      users: user_id,
    });
  } catch (error) {
    console.log(error);
  }
};

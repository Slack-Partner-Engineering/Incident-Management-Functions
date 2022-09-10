import { SlackAPI } from "deno-slack-api/mod.ts";

export const inviteUserToChannel = async (
  user_id: string,
  channel_id: string,
  token: string,
) => {
  console.log(user_id, channel_id);

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

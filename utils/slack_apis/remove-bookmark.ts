//The functions below will remove a bookmark. This is used to remove the
//bookmark to the call in the swarming channel, once an incident is closed.
//input: token, channel_id, bookmark_id
//output: none
//@see https://api.slack.com/methods/bookmarks.remove

import { SlackAPI } from "deno-slack-api/mod.ts";

export const removeBookmark = async (
  token: string,
  channel_id: string,
  bookmark_id: any,
) => {
  const client = SlackAPI(token);

  try {
    await client.bookmarks.remove({
      channel_id: channel_id,
      bookmark_id: bookmark_id,
    });
  } catch (error) {
    console.log(error);
  }
};

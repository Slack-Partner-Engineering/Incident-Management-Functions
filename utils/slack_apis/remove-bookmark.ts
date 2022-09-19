import { SlackAPI } from "deno-slack-api/mod.ts";

export const removeBookmark = async (
  token: string,
  channel_id: string,
  bookmark_id: any,
  // parent_id: string,
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

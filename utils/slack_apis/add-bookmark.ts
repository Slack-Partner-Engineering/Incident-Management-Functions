import { SlackAPI } from "deno-slack-api/mod.ts";

export const addBookmark = async (
  token: string,
  channel: string,
  title: string,
  type: string,
  link: string,
  emoji: string,
) => {
  const client = SlackAPI(token);

  try {
    const resp = await client.bookmarks.add({
      channel_id: channel,
      title: title,
      type: type,
      link: link,
      emoji: emoji,
    });
    return resp;
  } catch (error) {
    console.log(error);
  }
};

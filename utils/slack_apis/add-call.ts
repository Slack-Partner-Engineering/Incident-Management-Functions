import { SlackAPI } from "deno-slack-api/mod.ts";

export const addCall = async (
  join_url: string,
  external_unique_id: number,
  token: string,
) => {
  const client = SlackAPI(token);

  try {
    const res = await client.calls.add({
      join_url: join_url,
      external_unique_id: external_unique_id,
      token: token,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

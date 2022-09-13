import { SlackAPI } from "deno-slack-api/mod.ts";

export const endCall = async (
  callId: string,
  token: string,
) => {
  const client = SlackAPI(token);

  try {
    const res = await client.calls.end({
      id: callId,
      token: token,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

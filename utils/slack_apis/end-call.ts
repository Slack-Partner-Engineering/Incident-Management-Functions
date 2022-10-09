//This function will end a call.
//It will show how many people joined, whom joined, and how long the call was.
//input: token, callId
//output: API call response to /conversations.create
//@see https://api.slack.com/methods/calls.end

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

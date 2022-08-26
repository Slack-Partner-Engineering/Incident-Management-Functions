// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from "deno-slack-api/mod.ts";

export async function createChannel(
  token: string,
  incidentDescription: string,
) {
  const client = SlackAPI(token, {});

  const channelName = await createChannelName(incidentDescription);
  console.log("channelName");
  console.log(channelName);

  const santizedChannelName = await sanitizeChannelName(channelName);

  const resp = await client.apiCall("conversations.create", {
    name: santizedChannelName,
    is_private: false,
  });
  return resp;
}

async function createChannelName(
  incidentDescription: string,
) {
  const currentTimeStamp = await Date.now(); //build in incident increment logic or something here

  const channelName = currentTimeStamp + "-" + incidentDescription;
  return channelName;
}

async function sanitizeChannelName(
  channelName: any,
) {
  let channelStr = await channelName.toString();
  channelStr = channelStr.toLowerCase();
  channelStr = channelStr.split("");

  for (let i = 0; i < channelStr.length; i++) {
    if (channelStr[i] === " ") {
      console.log(typeof (channelStr[i]));
      (channelStr[i] as any) = "-";
    }
  }
  channelStr = channelStr.join("");
  console.log("channelStr");
  console.log(channelStr);
  return channelStr;
}

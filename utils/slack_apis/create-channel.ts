import { SlackAPI } from "deno-slack-api/mod.ts";

export const createChannel = async (
  token: string,
  incidentDescription: string,
  incident_id: string,
) => {
  const client = SlackAPI(token, {});

  const channelName = await createChannelName(
    incidentDescription.substring(0, 25),
    incident_id,
  );

  const santizedChannelName = await sanitizeChannelName(channelName);

  const resp = await client.apiCall("conversations.create", {
    name: santizedChannelName,
    is_private: false,
  });
  return resp;
};

function createChannelName(
  incidentDescription: string,
  incident_id: string,
) {
  const channelName = incident_id + "-" + incidentDescription;
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
      (channelStr[i] as any) = "-";
    }
    if (channelStr[i] === "'") {
      (channelStr[i] as any) = "";
    }
  }
  channelStr = channelStr.join("");
  return channelStr;
}

//This function will create a channel. It uses a couple of other helper functions to do this.
//See helper functions below.
//input: token, incidentDescription, incident_id
//output: API call response to /conversations.create
//@see https://api.slack.com/methods/conversations.create

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

  try {
    const resp = await client.apiCall("conversations.create", {
      name: santizedChannelName,
      is_private: false,
    });
    return resp;
  } catch (error) {
    console.log(error);
    return (error);
  }
};

//This helper function constructs a channel name based on the description and ID.
//input: incidentDescription, incident_id
//output: channel name with the incident description and ID
export const createChannelName = (
  incidentDescription: string,
  incident_id: string,
) => {
  const channelName = incident_id + "-" + incidentDescription;
  return channelName;
};

//This helper function sanitizes the channel name. For example, a channel
//name cannot have apostrophies or blank spaces, so we replace those.
//input: channelName
//output: sanitized channel name
export const sanitizeChannelName = async (
  channelName: any,
) => {
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
};

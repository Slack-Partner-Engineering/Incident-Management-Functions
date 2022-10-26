import { notififySlackChannelClerk } from "./notify-slack-channel.ts";
import type { Incident } from "../../../types/incident-object.ts";

const sendMessageToClerkAPI = async (
  message: string,
  phoneNumbers: Array<string>,
  env: any,
  incident: Incident,
  token: string,
) => {
  //check for env variable switch to either send to whatsapp or sms in the future
  //call Clerk API
  //send SMS
  const payload = {
    message: message,
    recipients: phoneNumbers,
  };

  if (phoneNumbers.length > 0 && env["CLERK_API"] != undefined) {
    const body = JSON.stringify(payload);
    const req = new Request(env["CLERK_API"], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "slack_api_key": env["CLERK_KEY"],
      },
      body,
    });
    await fetch(req);
    await notififySlackChannelClerk(
      token,
      incident,
    );
  }
  return;
};

//send Whatsapp
//add in the future

export { sendMessageToClerkAPI };

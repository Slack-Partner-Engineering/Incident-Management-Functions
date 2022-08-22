// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from "deno-slack-api/mod.ts";

export async function getUserName(token: any, userID: any) {
  const client = SlackAPI(token, {});

  const userInfoResp = await client.apiCall("users.info", {
    user: userID,
  });

  const user: any = await userInfoResp.user;

  return user.name;
}

export async function isSlackUser(
  token: string,
  userID: string,
): Promise<boolean> {
  const client = SlackAPI(token, {});

  const userInfoResp = await client.apiCall("users.info", {
    user: userID,
  });

  if (userInfoResp.error) {
    return false;
  }

  return true;
}

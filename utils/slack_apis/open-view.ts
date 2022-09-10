import { SlackAPI } from "deno-slack-api/mod.ts";

export const openView = async (
  token: string,
  modalView: any,
  trigger_id: string,
) => {
  const client = SlackAPI(token);
  try {
    const res = await client.views.open({
      trigger_id: trigger_id,
      view: modalView,
    });
  } catch (error) {
    console.log(error);
  }
};

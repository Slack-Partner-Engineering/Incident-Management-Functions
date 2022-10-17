//This view will generate the blocks to open a modal when sending an update to an incident.

export const sendUpdateModal = (
  incident: string,
) => {
  const view = {
    "type": "modal",
    "callback_id": "send_update_modal",
    "private_metadata": incident,
    "title": {
      "type": "plain_text",
      "text": "Send an Update",
      "emoji": true,
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true,
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true,
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "send_update_block",
        "element": {
          "type": "plain_text_input",
          "action_id": "send_update_action",
          "multiline": true,
        },
        "label": {
          "type": "plain_text",
          "text": "Incident Update",
          "emoji": true,
        },
      },
    ],
  };
  return view;
};

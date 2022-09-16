export const assignDRIModal = (
  incident: string,
) => {
  const view = {
    "type": "modal",
    "callback_id": "assign_dri_modal",
    "private_metadata": incident,
    "title": {
      "type": "plain_text",
      "text": "Assign DRI",
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
        "type": "section",
        "block_id": "assign_dri_block",
        "text": {
          "type": "mrkdwn",
          "text": "Assign a new DRI",
        },
        "accessory": {
          "type": "users_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a user",
            "emoji": true,
          },
          "action_id": "users_select_action",
        },
      },
    ],
  };
  return view;
};

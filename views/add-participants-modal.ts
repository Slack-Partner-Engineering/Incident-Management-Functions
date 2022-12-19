//This view will bring up a modal for adding participants to the incident.

export const addParticipantsModal = (
  incident: string,
) => {
  const view = {
    "type": "modal",
    "callback_id": "add_participants_modal",
    "private_metadata": incident,
    "title": {
      "type": "plain_text",
      "text": "Add Participants",
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
        "block_id": "add_participants_block",
        "element": {
          "type": "multi_users_select",
          "placeholder": {
            "type": "plain_text",
            "text": "Add Participants",
            "emoji": true,
          },
          "action_id": "add_participants_action",
        },
        "label": {
          "type": "plain_text",
          "text": "Select users to work on this incident",
          "emoji": true,
        },
      },
    ],
  };
  return view;
};

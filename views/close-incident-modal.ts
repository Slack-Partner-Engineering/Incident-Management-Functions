//This view will generate the blocks to open a modal when closing an incident.

export const closeIncidentModal = (
  incident: string,
) => {
  const view = {
    "type": "modal",
    "callback_id": "close_incident_modal",
    "private_metadata": incident,
    "title": {
      "type": "plain_text",
      "text": "Close Incident",
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
        "block_id": "add_comment_block",
        "element": {
          "type": "plain_text_input",
          "action_id": "close_incident_action",
          "multiline": true,
        },
        "label": {
          "type": "plain_text",
          "text": "Add Close Notes",
          "emoji": true,
        },
      },
    ],
  };
  return view;
};

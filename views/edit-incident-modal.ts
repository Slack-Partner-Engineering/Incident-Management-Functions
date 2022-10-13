//This view will edit the summary or long description of existing an incident.

export const editIncidentModal = (
  incident: string,
) => {
  const view = {
    "type": "modal",
    "callback_id": "edit_incident_modal",
    "private_metadata": incident,
    "title": {
      "type": "plain_text",
      "text": "Edit Incident",
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
        "block_id": "summary_block",
        "element": {
          "type": "plain_text_input",
          "action_id": "edit_summary_action",
        },
        "label": {
          "type": "plain_text",
          "text": "Summary (Limit 50 Characters)",
          "emoji": true,
        },
      },
      {
        "type": "input",
        "block_id": "long_desc_block",
        "element": {
          "type": "plain_text_input",
          "action_id": "edit_long_desc_action",
          "multiline": true,
        },
        "label": {
          "type": "plain_text",
          "text": "Long description",
          "emoji": true,
        },
      },
    ],
  };
  return view;
};

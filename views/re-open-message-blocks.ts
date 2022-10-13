//Blocks to post a message to thread or channel when the DRI is updated.

export function reOpenIncidentMessageBlocks(
  updateUser: any,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${updateUser}> has reopened the incident.`,
      },
    },
  ];

  return blocks;
}

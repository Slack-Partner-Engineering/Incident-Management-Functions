//Blocks to post a message to thread or channel when the DRI is updated.

export function editIncidentMessageBlocks(
  newSummary: string,
  newLongDesc: string,
  updateUser: string,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `<@${updateUser}> edited the incident with a new summary: *${newSummary}* and a new description:  *${newLongDesc}*`,
      },
    },
  ];

  return blocks;
}

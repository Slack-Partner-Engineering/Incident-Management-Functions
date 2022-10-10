//Blocks to post a message to thread or channel when the DRI is updated.

export function sendUpdateMessageBlocks(update: string, updateUser: string) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${updateUser}> sent an update: ${update}`,
      },
    },
  ];

  return blocks;
}

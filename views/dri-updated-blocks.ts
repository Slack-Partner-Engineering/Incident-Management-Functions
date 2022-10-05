//Blocks to post a message to thread or channel when the DRI is updated.

export function driUpdatedBlocks(dri: any) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${dri}>` +
          " is now the new DRI for this incident!",
      },
    },
  ];

  return blocks;
}

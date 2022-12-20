//Blocks to post a message to thread or channel when the DRI is updated.

export function closeNotesBlocks(
  comment: string,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `The incident has been closed with the following close notes: *${comment}*`,
      },
    },
  ];

  return blocks;
}

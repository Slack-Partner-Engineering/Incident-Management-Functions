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
          `The incident has been called All Clear with the following notes: *${comment}*`,
      },
    },
  ];

  return blocks;
}

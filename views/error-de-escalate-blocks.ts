//Blocks to post ephemerally when a user tries to deescalate a low.

export function errorDeEscalate() {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Cannot de escalate an incident which is at `Low` severity!",
      },
    },
  ];

  return blocks;
}

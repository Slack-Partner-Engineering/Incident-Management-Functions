//Blocks to post ephemerally when a user tries to escalate a critical.

export function errorEscalate() {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Cannot escalate an incident which is at `Critical` severity!",
      },
    },
  ];

  return blocks;
}

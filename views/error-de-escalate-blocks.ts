// deno-lint-ignore-file no-explicit-any
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

// deno-lint-ignore-file no-explicit-any
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

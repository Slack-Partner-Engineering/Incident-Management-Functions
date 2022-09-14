// deno-lint-ignore-file no-explicit-any
export function getPriorityIncreasedBlocks(
  previousPriority: any,
  newPriority: any,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Priority updated from " + "`" + previousPriority + "`" + " " +
          "→ " + "`" + newPriority + "`",
      },
    },
  ];

  return blocks;
}

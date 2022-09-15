// deno-lint-ignore-file no-explicit-any
export function getSeverityBlocks(
  previousPriority: any,
  newPriority: any,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Severity updated from " + "`" + previousPriority + "`" + " " +
          "→ " + "`" + newPriority + "`",
      },
    },
  ];

  return blocks;
}

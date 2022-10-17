//A view which will show the updated severity. This is
// deno-lint-ignore-file no-explicit-any
export function getSeverityBlocks(
  previousSeverity: any,
  newSeverity: any,
) {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Severity updated from " + "`" + previousSeverity + "`" + " " +
          "→ " + "`" + newSeverity + "`",
      },
    },
  ];

  return blocks;
}

// deno-lint-ignore-file no-explicit-any
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

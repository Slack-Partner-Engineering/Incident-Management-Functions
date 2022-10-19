export function clerkNotificationBlocks() {
  const blocks = [
    {
      type: "section",
      block_id: "clerk_blocks",
      text: {
        type: "mrkdwn",
        text:
          `:clerk: Clerk has notified Incident Leadership via SMS about this issue. They will be kept informed about any updates.`,
      },
    },
  ];
  return blocks;
}

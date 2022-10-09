//This is the view which shows the call block. This view enables Slack users to join a call.
export function getZoomBlock(
  callBlockId: string,
) {
  const blocks = [
    {
      "type": "call",
      "call_id": callBlockId,
    },
  ];
  return blocks;
}

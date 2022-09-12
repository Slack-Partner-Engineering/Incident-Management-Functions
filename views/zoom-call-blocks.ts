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

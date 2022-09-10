export function getZoomBlock(
  zoomURL: any,
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

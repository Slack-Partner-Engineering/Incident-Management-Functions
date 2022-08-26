// deno-lint-ignore-file no-explicit-any
export function getIncidentChannelBlocks(
  createChannelInfo: any,
) {
  console.log(" inside get inchednt blocks");
  console.log(createChannelInfo);
  const incidentChannelName = createChannelInfo.channel.name;
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Incident channel " + `#${incidentChannelName}` + " created!",
      },
    },
  ];
  return blocks;
}

export function getZoomBlock(
  zoomURL: any,
) {
  console.log(" inside get zoom block");
  console.log(zoomURL);
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Zoom meeting for this incident: " + `${zoomURL}`,
      },
    },
  ];
  return blocks;
}

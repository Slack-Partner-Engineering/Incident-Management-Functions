// deno-lint-ignore-file no-explicit-any
export function getIncidentChannelBlocks(
  createChannelInfo: any,
) {
  const incidentChannelName = createChannelInfo.channel.name;

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":warning: Incident channel " + `#${incidentChannelName}` +
          " created!",
      },
    },
  ];
  return blocks;
}

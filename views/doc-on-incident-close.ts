//View to push in the root cause analysis document to be used in channel.

export const documentOnIncidentClose = () => {
  return [
    {
      type: "section",
      block_id: "doc_on_incdient_close",
      text: {
        type: "mrkdwn",
        text:
          `*As this was a major incident, please use <https://slack1.box.com/s/r783r9wafmts2ala656l82ol50vo8h2s|this> template when creating the RCA document.*`,
      },
    },
  ];
};

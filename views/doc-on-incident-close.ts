//View to push in the root cause analysis document to be used in channel.

export const documentOnIncidentClose = (docURL: string) => {
  return [
    {
      type: "section",
      block_id: "doc_on_incdient_close",
      text: {
        type: "mrkdwn",
        text:
          `*As this was a major incident, we have auto created an RCA documents: <${docURL}|Start Working Here>*`,
      },
    },
  ];
};

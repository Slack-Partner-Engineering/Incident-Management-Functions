//This view is for a Box demo, showing what you could insert for an external URL

export const getBoxRunbook = () => {
  return [
    {
      type: "section",
      block_id: "box_run_book",
      text: {
        type: "mrkdwn",
        text: " :boxcorp:  Make sure to follow the " + "<" +
          `https://www.box.com` + "|" +
          "Incident Runbook" +
          ">" +
          " created.",
      },
    },
  ];
};

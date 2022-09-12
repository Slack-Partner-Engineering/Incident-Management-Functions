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

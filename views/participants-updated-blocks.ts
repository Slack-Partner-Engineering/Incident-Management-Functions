//Blocks to post a message to thread or channel when the DRI is updated.

export function participantsUpdatedBlocks(participantsArray: any) {
  let participants = "";

  for (let i = 0; i < participantsArray.length; i++) {
    participants += `<@${participantsArray[i]}> `;
  }

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${participants}` +
          "have been added to work on this incident!",
      },
    },
  ];

  return blocks;
}

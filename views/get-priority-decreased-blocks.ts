// deno-lint-ignore-file no-explicit-any
export function getPriorityDecreasedBlocks(
  previousPriority: any,
  newPriority: any,
) {
  let blocks: any;
  if (previousPriority == 5) {
    blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Error, you cannot de escalate an incident that is already at the lowest priority!",
        },
      },
    ];
  } else {
    let prevPriorityName, newPriorityName;

    switch (previousPriority) {
      case "1": {
        prevPriorityName = "Highest";
        newPriorityName = "High";
        break;
      }
      case "2": {
        prevPriorityName = "High";
        newPriorityName = "Medium";
        break;
      }

      case "3": {
        prevPriorityName = "Medium";
        newPriorityName = "Low";
        break;
      }
      case "4": {
        prevPriorityName = "Low";
        newPriorityName = "Lowest";
        break;
      }
    }
    blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Priority updated from " + "`" + prevPriorityName + "`" + " " +
            "→ " + "`" + newPriorityName + "`",
        },
      },
    ];
  }

  return blocks;
}

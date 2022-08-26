// deno-lint-ignore-file no-explicit-any
export function jiraIssueBlocks(
  env: any,
  issueInfo: any,
) {
  console.log(" inside get jiraIssueBlocks blocks");
  console.log(issueInfo);
  const issueKey = issueInfo.key;
  const instance = env["JIRA_INSTANCE"];

  const link = "https://" + instance + "/browse/" + issueKey;

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Jira Issue: " + "<" + `${link}` + "|" + issueKey + ">" +
          " created!",
      },
    },
  ];
  return blocks;
}

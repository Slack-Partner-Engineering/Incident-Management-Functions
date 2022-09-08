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

  // do I need to add private metadata or something to this block?
  // Later on I will need to have info such as the issueKey to be able to close the issue
  const blocks = [
    {
      type: "section",
      //can I even have a block_id here?
      block_id: "jira_issue_block",
      text: {
        type: "mrkdwn",
        text: "Jira Issue: " + "<" + `${link}` + "|" + issueKey + ">" +
          " created!",
      },
    },
  ];
  return blocks;
}

//This view shows the newly created Jira Cloud issue for the incident.
// deno-lint-ignore-file no-explicit-any
export function jiraIssueBlocks(
  env: any,
  issueInfo: any,
) {
  const issueKey = issueInfo.key
    ? issueInfo.key
    : issueInfo.incident_jira_issue_key;
  const instance = env["ATLASSIAN_INSTANCE"];

  const link = "https://" + instance + "/browse/" + issueKey;

  const blocks = [
    {
      type: "section",
      block_id: "jira_issue_block",
      text: {
        type: "mrkdwn",
        text: " :atlassian: Jira Issue: " + "<" + `${link}` + "|" + issueKey +
          ">" +
          " created.",
      },
    },
  ];
  return blocks;
}

export const getSalesforceIncidentBlocks = (salesforceUrl: string) => {
  return [
    {
      type: "section",
      block_id: "salesforce_incident_created",
      text: {
        type: "mrkdwn",
        text: ` :salesforce: <${salesforceUrl}|Salesforce Incident> created.`,
      },
    },
  ];
};

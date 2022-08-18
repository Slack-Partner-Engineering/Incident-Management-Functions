/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file
const newIncident = (incidentObject: any) => { //anoying type workaround, guess I will have to add the incident object as a type, creating a jira.
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*A new incident has been created by ${incidentObject.incident_trigger}*\n\n*Title*: ${incidentObject.short_description}\n*Severity*: ${incidentObject.severity}\n*Description*: ${incidentObject.long_description}\n*Incident Participants*: ${incidentObject.incident_participants}\n*Incident Start Time*: ${incidentObject.incident_start_time}\n*DRI*: ${incidentObject.incident_dri}`,
      },
    },
  ];

  return blocks;
};

export { newIncident };

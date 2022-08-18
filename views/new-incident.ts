const newIncident = (
  incidentObject: {
    incident_trigger: any;
    short_description: any;
    incident_participants: any;
    incident_dri: any;
  },
) => { //anoying type workaround, guess I will have to add the incident object as a type, creating a jira.
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `New incident has been created by ${incidentObject.incident_trigger} \n *Title*: ${incidentObject.short_description} \n *Severity*:  \n*Description*: \n*Incident Participants*: ${incidentObject.incident_participants} \n*Incident DRI*: ${incidentObject.incident_dri}`,
      },
    },
  ];

  return blocks;
};

export { newIncident };

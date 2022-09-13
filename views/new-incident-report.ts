const newIncidentReport = (incidentReport: any) => {
  let reportText = "";

  let incidentDRIs = "";
  for (const key in incidentReport.incidentDris) {
    if (
      Object.prototype.hasOwnProperty.call(incidentReport.incidentDris, key)
    ) {
      incidentDRIs += `<@${key}>`;
      console.log(key);
    }
  }

  reportText = reportText.concat(`:icon: *Incident Report* :icon: \n`)
    .concat(`Total Incidents: ${incidentReport.numberOfIncidents} \n`)
    .concat(`Swarming Incidents: ${incidentReport.numberOfSwarmingIncidents}\n`)
    .concat(`Open Incidents: ${incidentReport.numberOfOpenIncidents} \n`)
    .concat(`Closed Incidents: ${incidentReport.numberOfClosedIncidents}\n`)
    .concat(`Incident DRIs: ${incidentDRIs}`);

  const blocks: any = [
    {
      type: "section",
      block_id: "incident_report",
      text: {
        type: "mrkdwn",
        text: reportText,
      },
    },
  ];
  return blocks;
};

export { newIncidentReport };

//This view shows the incident report. It shows open, closed, swarming, and total incidents.
const newIncidentReport = (incidentReport: any) => {
  let reportText = "";

  let incidentDRIs = "";
  for (const key in incidentReport.incidentDris) {
    if (
      Object.prototype.hasOwnProperty.call(incidentReport.incidentDris, key)
    ) {
      incidentDRIs += `<@${key}>`;
    }
  }

  let incidentSeveritiesPercentage = "";
  for (const key in incidentReport.incidentSeverity) {
    if (
      Object.prototype.hasOwnProperty.call(incidentReport.incidentSeverity, key)
    ) {
      incidentSeveritiesPercentage += `${key}: ${
        Math.round(
          (incidentReport.incidentSeverity[key] /
            incidentReport.numberOfIncidents) * 100,
        )
      }% \n`;
    }
  }

  reportText = reportText.concat(`:icon: *Incident Report* :icon: \n`)
    .concat(`Total Incidents: ${incidentReport.numberOfIncidents} \n`)
    .concat(`Swarming Incidents: ${incidentReport.numberOfSwarmingIncidents}\n`)
    .concat(`Open Incidents: ${incidentReport.numberOfOpenIncidents} \n`)
    .concat(`Closed Incidents: ${incidentReport.numberOfClosedIncidents}\n`)
    .concat(`Incident DRIs: ${incidentDRIs}\n\n`)
    .concat(
      `Percentage of OPEN Incidents: ${
        Math.round(
          (incidentReport.incidentStatusCount.OPEN /
            incidentReport.numberOfIncidents) * 100,
        )
      }%\n\n`,
    )
    .concat(
      `Percentage of Incidents by Severity: \n${incidentSeveritiesPercentage}`,
    );

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

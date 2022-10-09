//This function will create a report and send it as an ephemeral message to the user. It will
//show the total incidents, open icidents, closed incidents, the DRIs, and percentage of incidents by severity.
//input: token
//output: A report object

import { getIncidents } from "../database/get-incident.ts";
import type { Incident } from "../../types/incident-object.ts";

const generateNewIncidentReport = async (token: string) => {
  const report = await getIncidents(token);

  report.numberOfIncidents = report.items.length;
  report.numberOfSwarmingIncidents = 0;
  report.numberOfOpenIncidents = 0;
  report.numberOfClosedIncidents = 0;
  report.incidentDris = {};
  report.incidentStatusCount = {};
  report.incidentSeverity = {};

  for (let i = 0; i < report.items.length; i++) {
    const element = <Incident> report.items[i];

    if (element.incident_swarming_msg_ts) {
      report.numberOfSwarmingIncidents++;
    }

    if (element.incident_status === "OPEN") {
      report.numberOfOpenIncidents++;
    } else {
      report.numberOfClosedIncidents++;
    }

    if (element.incident_dri) {
      report.incidentDris[element.incident_dri] = "";
    }

    if (element.incident_status) {
      if (report.incidentStatusCount[element.incident_status]) {
        report.incidentStatusCount[element.incident_status]++;
      } else {
        report.incidentStatusCount[element.incident_status] = 1;
      }
    }

    if (element.severity) {
      if (report.incidentSeverity[element.severity]) {
        report.incidentSeverity[element.severity]++;
      } else {
        report.incidentSeverity[element.severity] = 1;
      }
    }
  }

  return report;
};

export { generateNewIncidentReport };

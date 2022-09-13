import { getIncidents } from "../database/get-incident.ts";
import type { Incident } from "../../types/incident-object.ts";

const generateNewIncidentReport = async (token: string) => {
  const report = await getIncidents(token);

  report.numberOfIncidents = report.items.length;
  report.numberOfSwarmingIncidents = 0;
  report.numberOfOpenIncidents = 0;
  report.numberOfClosedIncidents = 0;
  report.incidentDris = {};

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
  }

  return report;
};

export { generateNewIncidentReport };

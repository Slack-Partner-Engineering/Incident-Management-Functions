//This function will take the previous priority and decrease it
//input: standard incident object, env, token, body
//output: channel URL, channel_id, incident object.
//
import { postMessage } from "../../utils/slack_apis/post-message.ts";
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { getSeverityBlocks } from "../../views/get-severity-blocks.ts";
import { getIncident } from "../../utils/database/get-incident.ts";
import { newIncident } from "../../views/new-incident.ts";
import { errorDeEscalate } from "../../views/error-de-escalate-blocks.ts";

export const deEscalateIncident = async (
  incident: Incident,
  env: any,
  token: any,
  body: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);
  const curSeverity = curIncident.severity;
  let newSeverity;
  if (curSeverity == "Low") {
    const errBlocks = await errorDeEscalate();
    await postReply(
      token,
      <string> curIncident.incident_channel,
      errBlocks,
      curIncident.incident_channel_msg_ts,
    );
  } else {
    switch (curSeverity) {
      case "Medium": {
        newSeverity = "Low";
        break;
      }
      case "High": {
        newSeverity = "Medium";
        break;
      }
      case "Critical": {
        newSeverity = "High";
        break;
      }
    }
    curIncident.severity = newSeverity;
    await updateIncident(token, curIncident);

    const severityBlocks = getSeverityBlocks(
      curSeverity,
      newSeverity,
    );
    const updateIncidentBlocks = await newIncident(curIncident);

    if (curIncident.incident_swarming_channel_id !== undefined) {
      incident.incident_swarming_channel_id;
      await postReply(
        token,
        <string> curIncident.incident_swarming_channel_id,
        severityBlocks,
        curIncident.incident_swarming_msg_ts,
      );
      await updateMessage(
        token,
        <string> curIncident.incident_swarming_channel_id,
        curIncident.incident_swarming_msg_ts,
        updateIncidentBlocks,
      );
    } else {
      await postReply(
        token,
        <string> curIncident.incident_channel,
        severityBlocks,
        curIncident.incident_channel_msg_ts,
      );

      await updateMessage(
        token,
        <string> curIncident.incident_channel,
        curIncident.incident_channel_msg_ts,
        updateIncidentBlocks,
      );
    }
  }
};

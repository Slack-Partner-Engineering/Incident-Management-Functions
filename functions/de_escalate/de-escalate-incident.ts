//This function will take the previous priority and decrease it
//input: standard incident object, env, token
//output: channel URL, channel_id, incident object.

import { postMessage } from "../../utils/slack_apis/post-message.ts";
import { postReply } from "../../utils/slack_apis/post-message.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { getSeverityBlocks } from "../../views/get-severity-blocks.ts";
import { getIncident } from "../../utils/database/get-incident.ts";
import { newIncident } from "../../views/new-incident.ts";
import { errorDeEscalate } from "../../views/error-de-escalate-blocks.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { sendMessageClerk } from "../../utils/externalAPIs/clerk/message-logic.ts";

export const deEscalateIncident = async (
  incident: Incident,
  env: any,
  token: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);
  const curSeverity = curIncident.severity;
  let newSeverity;
  //Check if the current severity is low. If it is, we send an error message
  if (curSeverity == "Low") {
    const errBlocks = await errorDeEscalate();
    //send an error message to swarming channel if there is one,
    if (curIncident.incident_swarming_channel_id !== undefined) {
      await postMessage(
        token,
        <string> curIncident.incident_swarming_channel_id,
        errBlocks,
      );
    } else {
      //otherwise send the error message to the regular incident channel
      await postReply(
        token,
        <string> curIncident.incident_channel,
        errBlocks,
        curIncident.incident_channel_msg_ts,
      );
    }
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
    // check if we are in swarming channel. If we are, we
    // need to use the view without the `Create Channel` button
    const updateIncidentBlocks = await newIncident(curIncident);
    const swarmIncidentBlocks = await swarmIncident(curIncident);

    if (curIncident.incident_swarming_channel_id !== undefined) {
      incident.incident_swarming_channel_id;
      await postMessage(
        token,
        <string> curIncident.incident_swarming_channel_id,
        severityBlocks,
      );
      await updateMessage(
        token,
        <string> curIncident.incident_swarming_channel_id,
        curIncident.incident_swarming_msg_ts,
        swarmIncidentBlocks,
      );
      const updatedIncidentChannelBlocks =
        await swarmIncidentOriginalMessageUpdate(
          curIncident,
        );
      await updateMessage(
        token,
        <string> curIncident.incident_channel,
        curIncident.incident_channel_msg_ts,
        updatedIncidentChannelBlocks,
      );
      await updateSalesforceIncident(curIncident, env, token);
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
      await updateSalesforceIncident(curIncident, env, token);
      await sendMessageClerk(incident, env, "deescalated");
    }
  }
};

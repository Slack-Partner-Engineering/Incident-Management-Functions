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
    console.log("cannot de escalate a low severity incident");
    const reply = await postReply(
      token,
      <string> curIncident.incident_channel,
      errBlocks,
      curIncident.incident_channel_msg_ts,
    );
    console.log(reply);
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
      console.log(incident.incident_swarming_channel_id);
      const reply = await postReply(
        token,
        <string> curIncident.incident_swarming_channel_id,
        severityBlocks,
        curIncident.incident_swarming_msg_ts,
      );
      console.log(" Reply after posting in incident swarming channel");
      console.log(reply);
      const updateMsgResp = await updateMessage(
        token,
        <string> curIncident.incident_swarming_channel_id,
        curIncident.incident_swarming_msg_ts,
        updateIncidentBlocks,
      );
      console.log(" updateMsgResp after posting in incident swarming channel");
      console.log(updateMsgResp);
    }
    const reply = await postReply(
      token,
      <string> curIncident.incident_channel,
      severityBlocks,
      curIncident.incident_channel_msg_ts,
    );
    console.log(" Reply after posting in reg channel");
    console.log(reply);
    const updateMsgResp = await updateMessage(
      token,
      <string> curIncident.incident_channel,
      curIncident.incident_channel_msg_ts,
      updateIncidentBlocks,
    );
    console.log(" updateMsgResp after posting in reg channel");
    console.log(updateMsgResp);
  }
};

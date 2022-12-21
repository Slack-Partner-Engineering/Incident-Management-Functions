//This function should close and archive the incident if there is a swarming channel.
//It will change the status from ALL CLEAR to CLOSED.
//input: standard incident object, env, token
//output: none.

import { Incident } from "../../types/incident-object.ts";
import { updateIncident } from "../../utils/database/update-incident.ts";
import { getIncident } from "../../utils/database/get-incident.ts";
import { updateSalesforceIncident } from "../../salesforce/update-salesforce-incident.ts";
import { sendMessageClerk } from "../../utils/externalAPIs/clerk/message-logic.ts";
import { archiveChannel } from "../../utils/slack_apis/archive-channel.ts";
import { afterArchiveBlocks } from "../../views/after-archive-blocks.ts";
import { updateMessage } from "../../utils/slack_apis/update-message.ts";
import { setTopic } from "../../utils/slack_apis/set-topic.ts";

export const closeAndArchive = async (
  incident: Incident,
  env: any,
  token: any,
) => {
  const curIncident = await getIncident(token, <string> incident.incident_id);

  curIncident.incident_status = "CLOSED";
  await updateIncident(token, curIncident);

  const postArciveBlocks = await afterArchiveBlocks(curIncident);

  await updateMessage(
    token,
    <string> incident.incident_channel,
    incident.incident_channel_msg_ts,
    postArciveBlocks,
  );

  // check if we are in swarming channel. If we are, we archive that channel.
  if (curIncident.incident_swarming_channel_id !== undefined) {
    await setTopic(
      token,
      curIncident.incident_swarming_channel_id,
      `CLOSED ${incident.long_description?.substring(0, 250)}`,
    );

    await updateMessage(
      token,
      <string> incident.incident_channel,
      incident.incident_swarming_msg_ts,
      postArciveBlocks,
    );

    await archiveChannel(
      token,
      <string> curIncident.incident_swarming_channel_id,
    );
  }
  await updateSalesforceIncident(curIncident, env, token);
  await sendMessageClerk(curIncident, env, "reopen", token);
};

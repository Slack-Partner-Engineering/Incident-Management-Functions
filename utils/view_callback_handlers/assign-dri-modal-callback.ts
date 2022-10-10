import { driUpdatedBlocks } from "../../views/dri-updated-blocks.ts";
import { newIncident } from "../../views/new-incident.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { getIncident } from "../database/get-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { postMessage } from "../slack_apis/post-message.ts";
import { updateMessage } from "../slack_apis/update-message.ts";
import { postReply } from "../slack_apis/post-message.ts";

const assignDRIModalCallback = async (view: any, token: string) => {
  const incidentID = await JSON.parse(view.private_metadata).incident_id;
  const incident = await getIncident(token, incidentID);
  const dri =
    view.state.values.assign_dri_block.users_select_action.selected_users[0];
  incident.incident_dri = dri;
  await updateIncident(token, incident);
  const driBlocks = await driUpdatedBlocks(dri);

  if (incident.incident_swarming_channel_id !== undefined) {
    const updatedIncidentBlocks = await swarmIncident(incident);
    await updateMessage(
      token,
      incident.incident_swarming_channel_id,
      incident.incident_swarming_msg_ts,
      updatedIncidentBlocks,
    );

    const updatedIncidentChannelBlocks =
      await swarmIncidentOriginalMessageUpdate(
        incident,
      );
    await updateMessage(
      token,
      incident.incident_channel,
      incident.incident_channel_msg_ts,
      updatedIncidentChannelBlocks,
    );

    await postMessage(
      token,
      incident.incident_swarming_channel_id,
      driBlocks,
    );
  } else {
    const blocks = await newIncident(incident);
    await updateMessage(
      token,
      incident.incident_channel,
      incident.incident_channel_msg_ts,
      blocks,
    );
    await postReply(
      token,
      incident.incident_channel,
      driBlocks,
      incident.incident_channel_msg_ts,
    );
  }
};

export { assignDRIModalCallback };

//This function will take the input from the modal for the assignDRI and execute the
//needed backed updates (such as update to DB) once the view is submitted.

import { participantsUpdatedBlocks } from "../../views/participants-updated-blocks.ts";
import { newIncident } from "../../views/new-incident.ts";
import { swarmIncidentOriginalMessageUpdate } from "../../views/swarm-incident-original-message-update.ts";
import { swarmIncident } from "../../views/swarm-incident.ts";
import { getIncident } from "../database/get-incident.ts";
import { updateIncident } from "../database/update-incident.ts";
import { postMessage } from "../slack_apis/post-message.ts";
import { updateMessage } from "../slack_apis/update-message.ts";
import { postReply } from "../slack_apis/post-message.ts";
import { inviteUserToChannel } from "../../utils/slack_apis/invite-user-to-channel.ts";

const addParticipantsModalCallback = async (view: any, token: string) => {
  const incidentID = await JSON.parse(view.private_metadata).incident_id;
  const incident = await getIncident(token, incidentID);
  let participantsArr;
  if (incident.incident_participants === undefined) {
    participantsArr = [];
  } else {
    participantsArr = JSON.parse(incident.incident_participants);
  }
  const incidentParticipants =
    view.state.values.add_participants_block.add_participants_action
      .selected_users;
  for (let i = 0; i < incidentParticipants.length; i++) {
    participantsArr.push(incidentParticipants[i]);
  }

  let participants = "";
  for (let i = 0; i < participantsArr.length; i++) {
    participants += `<@${participantsArr[i]}> `;
  }

  incident.incident_participants = JSON.stringify(participantsArr);
  await updateIncident(token, incident);
  const participantsBlocks = await participantsUpdatedBlocks(
    incidentParticipants,
  );

  if (incident.incident_swarming_channel_id !== undefined) {
    const updatedIncidentBlocks = await swarmIncident(incident);
    for (let i = 0; i < participantsArr.length; i++) {
      await inviteUserToChannel(
        participantsArr[i],
        incident.incident_swarming_channel_id,
        token,
      );
    }
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
      participantsBlocks,
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
      participantsBlocks,
      incident.incident_channel_msg_ts,
    );
  }
};

export { addParticipantsModalCallback };

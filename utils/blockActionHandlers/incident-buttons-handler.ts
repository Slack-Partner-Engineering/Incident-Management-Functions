import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";
import { postNewIncident } from "../../functions/send_to_slack/post_incident/definition.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";
import { createZoomMeeting } from "../externalAPIs/zoom/createMeeting.ts";
import { createChannel } from "../slack_apis/create-channel.ts";
import {
  getIncidentChannelBlocks,
  getZoomBlock,
} from "../../views/get-channel-blocks.ts";
import { postMessage, postReply } from "../slack_apis/post-message.ts";

import { closeIncidentModal } from "../../views/close-incident-modal.ts";

const router = BlockActionsRouter(postNewIncident);

console.log("hitttt");

export const incidentHandler = router.addHandler(
  [
    "close_incident",
    "create_channel",
    "escalate",
    "de_escalate",
    "assign_dri",
    "add_members",
  ],
  async ({ action, body, token, env, inputs }) => {
    console.log(inputs.severity);

    const client = SlackAPI(token);

    switch (action.action_id) {
      case "create_channel": {
        console.log("hit create channel statement");
        const shortDescription = body.function_data.inputs.short_description;
        const meetingResp = await createZoomMeeting(env);
        const createChannelResp = await createChannel(token, shortDescription);
        console.log(createChannelResp);
        const channelBlocks = await getIncidentChannelBlocks(createChannelResp);
        await postReply(
          token,
          body.container.channel_id,
          channelBlocks,
          body.container.message_ts,
        );
        const zoomBlocks = await getZoomBlock(meetingResp.join_url);
        await postMessage(
          token,
          createChannelResp.channel.id,
          zoomBlocks,
        );
        break;
      }

      case "close_incident": {
        console.log("action value");
        console.log(action.value);
        const issueKey = await JSON.parse(action.value).incident_jira_isse_key;
        console.log("issueKey");
        console.log(issueKey);
        const ModalView = await closeIncidentModal(issueKey);
        //open the modal with the view which we created above
        await client.views.open({
          trigger_id: body.trigger_id,
          view: ModalView,
        });
        break;
      }

      case "escalate":
        console.log("hit escalate statement");
        break;

      case "de_escalate":
        console.log("hit de_escalate statement");
        break;

      case "assign_dri":
        console.log("hit assign_dri statement");
        break;

      case "add_members":
        console.log("hit add_members statement");
        break;

      default:
        break;
    }
  },
);

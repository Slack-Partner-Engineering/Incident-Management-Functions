//this function should post the details of a new incident in the incident channel. The channel id is hard coded for now but will likely  be a env param moving forward.
//input: standard incident object
//output: none
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { postNewIncident } from "./definition.ts";
import { newIncident } from "../../../views/new-incident.ts";
import type { Incident } from "../../../types/incident-object.ts";
import { postMessage } from "../../../utils/slack_apis/post-message.ts";
import { incidentHandler } from "../../../utils/blockActionHandlers/incident-buttons-handler.ts";
import { saveNewIncident } from "../../../utils/database/create-incident.ts";
import { createJiraIssue } from "../../../utils/externalAPIs/atlassian/createJiraIssue.ts";
import { postReply } from "../../../utils/slack_apis/post-message.ts";
import { closeIncidentBlocks } from "../../../views/close-incident-blocks.ts";
import { addJiraComment } from "../../../utils/externalAPIs/atlassian/addJiraComment.ts";
import { updateJiraPriorityToLow } from "../../../utils/externalAPIs/atlassian/updateJiraPriority.ts";
import { jiraIssueBlocks } from "../../../views/jira-issue-blocks.ts";
import { getIncident } from "../../../utils/database/get-incident.ts";
import { updateIncident } from "../../../utils/database/update-incident.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    const incidentChannel = env["INCIDENT_CHANNEL"];

    const incident = <Incident> inputs;
    const createIssueResp = await createJiraIssue(env, incident);
    incident.incident_jira_issue_key = createIssueResp.key;
    incident.incident_status = "OPEN";
    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;

    const blocks = await newIncident(incident);

    const postMsgResp = await postMessage(
      token,
      incidentChannel,
      blocks,
    );

    incident.incident_channel_msg_ts = await postMsgResp.ts;
    await updateIncident(token, incident);

    const jiraIssueMessage = await jiraIssueBlocks(env, createIssueResp);

    await postReply(
      token,
      incidentChannel,
      jiraIssueMessage,
      postMsgResp.ts,
    );
    return {
      completed: false,
    };
  };

export default postIncident;

export const blockActions = incidentHandler;

export const viewSubmission = async (
  { view, body, token, env }: any,
) => {
  if (view.callback_id === "close_incident_modal") {
    // save the currentTime so that we know what time the incident was closed
    const incident = await JSON.parse(view.private_metadata);
    console.log("incident: ");
    console.log(incident);
    incident.incident_status = "CLOSED";
    const incidentJiraKey = incident.incident_jira_issue_key;
    const comment =
      view.state.values.add_comment_block.close_incident_action.value;

    await addJiraComment(
      env,
      incidentJiraKey,
      comment,
    );

    await updateJiraPriorityToLow(env, incidentJiraKey);
    // const closeBlocks = await closeIncidentBlocks(incident);
    // const incidentChannel = env["INCIDENT_CHANNEL"];
    // const curIncident = await getIncident(token, incident.incident_id);
  }
};

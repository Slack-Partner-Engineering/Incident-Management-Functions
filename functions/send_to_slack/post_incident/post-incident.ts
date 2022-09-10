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
import { jiraIssueBlocks } from "../../../views/jira-issue-blocks.ts";
import { addJiraComment } from "../../../utils/externalAPIs/atlassian/addJiraComment.ts";
import { updateStatus } from "../../../utils/externalAPIs/atlassian/updateStatus.ts";

const postIncident: SlackFunctionHandler<typeof postNewIncident.definition> =
  async (
    { inputs, token, env },
  ) => {
    const incidentChannel = env["INCIDENT_CHANNEL"];

    const incident = <Incident> inputs;
    const createIssueResp = await createJiraIssue(env, incident);
    //call to database to save incident and assign incident id
    incident.incident_id = (await saveNewIncident(token, incident)).incident_id;
    incident.incident_jira_issue_key = createIssueResp.key;
    incident.incident_status = "OPEN";

    const blocks = await newIncident(incident);

    const postMsgResp = await postMessage(
      token,
      incidentChannel,
      blocks,
    );

    //this channel should be configurable, env variable or something.
    //TODO: check if we need to save the ticket associated with this incident in the DB,
    // Might need to query for it later in the viewSubmission handler

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
  { body, view, inputs, env }: any,
) => {
  if (view.callback_id === "close_incident_modal") {
    // save the currentTime so that we know what time the incident was closed
    const currentTime = Date.now();
    const issueKey = view.private_metadata;
    const comment =
      view.state.values.add_comment_block.close_incident_action.value;
    const addCommentResp = await addJiraComment(
      env,
      issueKey,
      comment,
    );

    const updateStatusResp = await updateStatus(env, issueKey);

    //update the DB wit the close notes
    // update the incident close time

    // at this point, we should actually just call //addComment in here,
    //since we have the view.inputs now

    // await callPostIncident(view, token, body, inputs);
  }
};

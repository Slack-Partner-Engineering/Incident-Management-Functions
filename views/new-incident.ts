import { BlockActionsRouter } from "https://deno.land/x/deno_slack_sdk@0.1.0/mod.ts";

const newIncident = (incidentObject: any) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `New incident has been created by ${incidentObject.incident_trigger} \n *Title*: ${incidentObject.short_description} \n *Severity*:  \n*Description*: \n*Incident Participants*: ${incidentObject.incident_participants} \n*Incident DRI*: ${incidentObject.incident_dri}`,
      },
    },
  ];

  return blocks;
};

export { newIncident };

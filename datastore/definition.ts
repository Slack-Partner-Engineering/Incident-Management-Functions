// This file defines the database structure for the app.
// There are 3 tables.
// Incidents is the main table that captures all incident data
// AuditIncidents is used to capture changes to the incidents. This can be used to send to another system or build reports on Slack
// SalesforceAuth is used to capture Salesforce Auth specifically.

import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const Incident = DefineDatastore({
  name: "Incidents",
  primary_key: "incident_id",
  attributes: {
    //ID to track the incident, Ex: INC-123456789.
    incident_id: {
      type: Schema.types.string,
    },
    //Low, Medium, High, Critical. Critical is the highest priority incident.
    severity: {
      type: Schema.types.string,
    },
    //Summary.
    short_description: {
      type: Schema.types.string,
    },
    long_description: {
      type: Schema.types.string,
    },
    incident_participants: {
      type: Schema.types.string,
    },
    //The main person who will be responsible for the incident.
    incident_dri: {
      type: Schema.types.string,
    },
    incident_start_time: {
      type: Schema.types.string,
    },
    //Can be a person (if created manually through the button), or an external service such as Pagerduty.
    incident_trigger: {
      type: Schema.types.string,
    },
    //External ID if assigned by an external service, such as PagerDuty.
    external_incident_id: {
      type: Schema.types.string,
    },
    //Who created the incident
    slack_reporter: {
      type: Schema.types.string,
    },
    //Which channel to post updates to. This is where all incident information will congregate.
    incident_channel: {
      type: Schema.types.string,
    },
    incident_channel_url: {
      type: Schema.types.string,
    },
    //The timestamp of the original incident message. Needed to post replies to original message.
    incident_channel_msg_ts: {
      type: Schema.types.string,
    },
    //Channel to swarm in. This will be autopopulated with incident info, and Zoom call will be created.
    incident_swarming_channel_id: {
      type: Schema.types.string,
    },
    incident_swarming_channel_url: {
      type: Schema.types.string,
    },
    //Timestamp of the incident message in the swarming channel. Needed to post replies.
    incident_swarming_msg_ts: {
      type: Schema.types.string,
    },
    //Timestamp of when the incident was closed.
    incident_closed_ts: {
      type: Schema.types.string,
    },
    //Resolution notes to be added into external systems.
    incident_close_notes: {
      type: Schema.types.string,
    },
    //Key to Jira Issue created from the incident.
    incident_jira_issue_key: {
      type: Schema.types.string,
    },
    //Open, or Closed.
    incident_status: {
      type: Schema.types.string,
    },
    //This is used to keep track of the Zoom call (or other Call) in the swarming channel.
    incident_call_id: {
      type: Schema.types.string,
    },
    salesforce_incident_id: {
      type: Schema.types.string,
    },
    //Id of bookmark to Zoom call. Needed to remove the bookmark when incident is closed.
    zoom_call_bookmark_id: {
      type: Schema.types.string,
    },
    last_incident_update: {
      type: Schema.types.string,
    },
    last_incident_update_ts: {
      type: Schema.types.string,
    },
    //If leadership has been sent messages / updates from incident.
    leadership_paged: {
      type: Schema.types.boolean,
    },
    //Root Cause Analysis bookmark ID, needed to remove the bookmark once an incident is re-opened.
    rca_doc_bookmark_id: {
      type: Schema.types.string,
    },
  },
});

const AuditIncidents = DefineDatastore({
  name: "AuditIncidents",
  primary_key: "incident_id_and_timestamp",
  attributes: {
    incident_id_and_timestamp: {
      type: Schema.types.string,
    },
    incident_object: {
      type: Schema.types.string,
    },
  },
});

const SalesforceAuth = DefineDatastore({
  name: "SalesforceAuth",
  primary_key: "salesforce_org_id",
  attributes: {
    salesforce_org_id: {
      type: Schema.types.string,
    },
    access_token: {
      type: Schema.types.string,
    },
    refresh_token: {
      type: Schema.types.string,
    },
    date_time_access_token_issued: {
      type: Schema.types.number,
    },
  },
});
export { AuditIncidents, Incident, SalesforceAuth };

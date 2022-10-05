//This file defines the database structure for the app.
//There are 3 tables.
// Incidents is the main table that captures all incident data
//AuditIncidents is used to capture changes to the incidents. This can be used to send to another system or build reports on Slack
//SalesforceAuth is used to capture Salesforce Auth specifically.

import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const Incident = DefineDatastore({
  name: "Incidents",
  primary_key: "incident_id",
  attributes: {
    incident_id: {
      type: Schema.types.string,
    },
    severity: {
      type: Schema.types.string,
    },
    short_description: {
      type: Schema.types.string,
    },
    long_description: {
      type: Schema.types.string,
    },
    incident_participants: {
      type: Schema.types.string,
    },
    incident_dri: {
      type: Schema.types.string,
    },
    incident_start_time: {
      type: Schema.types.string,
    },
    incident_trigger: {
      type: Schema.types.string,
    },
    external_incident_id: {
      type: Schema.types.string,
    },
    slack_reporter: {
      type: Schema.types.string,
    },
    incident_channel: {
      type: Schema.types.string,
    },
    incident_channel_url: {
      type: Schema.types.string,
    },
    incident_channel_msg_ts: {
      type: Schema.types.string,
    },
    incident_swarming_channel_id: {
      type: Schema.types.string,
    },
    incident_swarming_channel_url: {
      type: Schema.types.string,
    },
    incident_swarming_msg_ts: {
      type: Schema.types.string,
    },
    incident_closed_ts: {
      type: Schema.types.string,
    },
    incident_close_notes: {
      type: Schema.types.string,
    },
    incident_jira_issue_key: {
      type: Schema.types.string,
    },
    incident_status: {
      type: Schema.types.string,
    },
    incident_call_id: {
      type: Schema.types.string,
    },
    salesforce_incident_id: {
      type: Schema.types.string,
    },
    zoom_call_bookmark_id: {
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

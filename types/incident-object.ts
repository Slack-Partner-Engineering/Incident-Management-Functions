//There is one custom type. The incident object.
export type Incident = {
  incident_id?: string | undefined;
  severity: string;
  short_description: string;
  long_description?: string;
  incident_participants?: string | undefined;
  incident_dri?: string | undefined;
  incident_start_time: string | undefined;
  incident_trigger?: string;
  external_incident_id?: string | undefined;
  slack_reporter?: string | undefined;
  incident_channel?: string | undefined;
  incident_channel_url?: string | undefined;
  incident_channel_msg_ts?: string | undefined;
  incident_swarming_channel_id?: string | undefined;
  incident_swarming_channel_url?: string | undefined;
  incident_swarming_msg_ts?: string | undefined;
  incident_closed_ts?: string | undefined;
  incident_close_notes?: string | undefined;
  incident_jira_issue_key?: string | undefined;
  incident_status: string;
  incident_call_id: string;
  salesforce_incident_id: string;
  zoom_call_bookmark_id: string;
};

export type Incident = {
  short_description: string;
  severity: string;
  long_description?: string;
  incident_participants?: string | undefined;
  incident_dri?: string | undefined;
  incident_start_time: string | undefined;
  incident_trigger?: string;
  incident_id?: string | undefined;
  external_incident_id?: string;
  slack_reporter?: string | undefined;
  incident_channel_url?: string | undefined;
  incident_channel_msg_ts?: string | undefined;
  incident_swarming_channel_id?: string | undefined;
  incident_swarming_channel_url?: string | undefined;
  incident_closed_ts?: string | undefined;
  incident_close_notes?: string | undefined;
};

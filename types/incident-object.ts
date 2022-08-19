export type Incident = {
  short_description: string;
  severity: string;
  long_description?: string;
  incident_participants?: string | undefined;
  incident_dri?: string | undefined;
  incident_start_time: string | undefined;
  incident_trigger?: string;
  incident_id?: string;
  external_incident_id?: string;
  slack_reporter?: string | undefined;
  incident_channel?: string | undefined;
};

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
    indident_id: {
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
    incident_status: {
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
export { AuditIncidents, Incident };

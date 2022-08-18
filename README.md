# Incident-Management-Functions

These functions are currently a work in progress!

## Running it locally

```bash
hermes run
```

## Deploying to Slack's Hosting

```bash
hermes deploy
```

## Seeing it in action

After creating your app, you'll need to create a new trigger that will start the
workflow.

```bash
hermes trigger create --trigger-def triggers/trigger.ts
```

This provides a URL that you can now paste into your slack workspace to run the
workflow! You can also add the url to the bookmarks bar of a channel!

You will need to now run `hermes run` to be able to use the workflow.

To run the external Webhook trigger you will need to create the trigger in the
same way but pass in the JSON version of trigger creation. This can also be done
with a Typescript file.

```bash
hermes trigger create --trigger-def  "./triggers/trigger_webhook.json"
```

You will see something like:

```bash
⚡ Trigger created
   Trigger ID:   Ft03UTJ9BYBA
   Trigger Type: webhook
   Trigger Name: Create Incident From External Source via Webhook
   Webhook URL:  https://hooks.slack.com/triggers/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
```

The `Webhook URL` is what you will want to use to trigger an incident from
outside of Slack.

Sample API Call

```bash
curl --location --request POST 'https://hooks.slack.com/triggers/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' \
--header 'Content-Type: application/json' \
--data-raw '{
"short_description": "Many reports that site is down!",
"severity": "High",
"external_incident_id": "XX-2345"
}'
```

## Building the App

To test new changes before pushing, you can use the `build.sh` script to format,
lint, and test the code. Once all checks pass, feel free to add your pull
request.

## Testing

You can write tests for your function, see `functions/reverse_test.ts` for a
sample. Test base filenames should be suffixed with `_test`. To run tests just
run:

```bash
slack deno test
```

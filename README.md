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

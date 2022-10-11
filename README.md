# Incident-Management-Functions ⚠️

The incident management functions are a set of functions used to optimize the process of incident management within Slack. This project utilizes 
Jira, Salesforce, Zoom, Box, and other partners to save incident data. It utilizes the beta [Slack CLI](https://api.slack.com/future/tools/cli) to create functions.

## Disclaimer
This project is built using pre-released features on the Slack Platform. It may contain bugs, performance issues, and isn't representative of the final product. The code in this project isn't meant to be a standard template. It may change or become legacy as updates are released to the Slack Beta Platform.

https://user-images.githubusercontent.com/10428517/195149574-c8bb012e-f9d0-410d-b321-6151cd9e1ffe.mp4

# Steps 
1. [Clone the repo](#step-1-clone-the-repo)
2. [Configuration Via Environmental Variables](#step-2-configuration-via-environmental-variables)
3. [Deploy the App](#step-3-deploy-the-app)
4. [Add Environmental Variables to Slack Cloud](#step-4-add-environmental-variables-to-slack-cloud)
5. [Create the Triggers](#step-5-Create-the-triggers)
6. [Run the Workflows and Create an Incident](#step-6-run-the-workflows-and-create-an-incident)
7. [View Incident Details in Jira and Salesforce](#step-7-view-incident-details-in-jira-and-salesforce)
8. [Create Swarming Channel](#step-8-create-swarming-channel)
9. [Close the Incident](#step-9-close-the-incident)
10. [Generate a Report](#step-10-generate-a-report)

## Step 1. Clone the Repo

```git clone https://github.com/Slack-Partner-Engineering/Incident-Management-Functions.git```

## Step 2. Configuration Via Environmental Variables

Next, you will have to configure your app by setting enviornmental variables. This will enable you to send incident data to your exteral accounts, such as 
Zendesk, Jira, Salesforce and others.

Go ahead and open the `.sample.env` file. 
There you will find  the necessary environmental variables. A completed `.env` file should look like the following:

```
INCIDENT_CHANNEL=C03V2ED7111
ZOOM_JWT_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhddkgzU1lDd0s5TXd1bDlQd3ciLCJleHAiOjE5ODgyMTU5MjAsImlhdCI6MTY2MTQ0NDI4Nn0.nSqPuhfrt47Gqln2bDj9CEnk-x7dxVMgQlOzYinL8Hk
JIRA_USERNAME=testtiu@gmail.com
JIRA_API_KEY=sPadwkkffh5u6JkCCD04
JIRA_INSTANCE=test.atlassian.net
JIRA_PROJECT=INC
SALESFORCE_CLIENT_ID=3MVG9p1Q1BCe9fvF1KeDHqX9VVsOlNBYh9sCbgCPXbgfddA4wZl4DMC5IYFBa1A5VnV
SALESFORCE_CLIENT_SECRET=5BA53B4CBAA248F1D23798E6D1CEEE89278F3F73B9A6688303F
SALESFORCE_INSTANCE_URL=https://slack-ed.my.salesforce.com
SALESFORCE_USER_EMAIL=grtest@gmail.com
SALESFORCE_USERNAME=test@gmail.com
SALESFORCE_REDIRECT_URL=http://localhost/redirect
SALESFORCE_LOGIN_URL=https://stest.my.salesforce.com
ACCESS_TOKEN=00D5f000005X2hB!AQ4AQK7RwdGtestKP2Ea9KkvteCoN65xvWN6m6xWQ0rR0SD.a8ir3LeULrNNZBvc2mqL18xgR9Okg_S4stp73
SALESFORCE_REFRESH_TOKEN=5Aep861FpKltestvYpULZ1ddCdnfHvpiFU7Jr95VBDX6KdVOMmpQkQuwG
SALESFORCE_USER_ID=0055f000test
SALESFORCE_ORG_ID=00D5f000test
SALESFORCE_API_VERSION=v55.0
```

> If you want to run this in local mode, you will need to copy the `sample.env` file, rename it to `.env`, add your env variables, and then run `source .env` to set your variables. Next, run `slack run` to run the app in local mode.

### Notes on Getting API Keys

* `INCIDENT_CHANNEL` is where you will be interacting with the app. It is where the app will post updates about your incident. It needs to be a public Slack channel.

* `ZOOM_JWT_TOKEN` will need to be collected from the Zoom Developer Site, here: https://marketplace.zoom.us/develop/create. You will need to create a free 
Zoom developer account, and then create a JWT token, as shown below:

![ZoomToken](https://user-images.githubusercontent.com/10428517/195176403-1a2ee3c7-f423-4fb3-b177-a4bc2b49cb72.png)

* `JIRA_USERNAME` is the email from your Jira Cloud developer account. This is needed to create Jira Issues.

* `JIRA_API_KEY` can be managed from here: https://id.atlassian.com/manage-profile/security/api-tokens. Make sure to create one, and then save it in a safe place.

* `JIRA_PROJECT` is the project `Key` that you want to add issues to. The names of your projects can be found here, under the `Key` field: https://horeaporutiu.atlassian.net/jira/projects. It is usually a three letter upper case name, as shown below:

![JiraKey](https://user-images.githubusercontent.com/10428517/195177542-1fd06cf0-2170-4a26-a96b-eeb08b59c1a6.png)

The rest of the env variables are to be retrieved from your Salesforce Developer account.

## Step 3. Deploy the App

In order to be able to add env variables to a deployed app, you will need to deploy it first!
Run `slack deploy` to do so. If all went well, you will see the following message:

> Note, I've created an alias for my Slack CLI, `hermes`. `hermes deploy` will yeild the same result as `slack deploy`.

```
hporutiu@hporuti-ltmkkef Incident-Management-Functions % hermes deploy
? Choose a workspace  [Use arrows to move, type to filter]
> homesiteappworkshop  Team ID: T0344K**** 
? Choose a workspace devrelsandbox  Team ID: T038J6T**** 
   App ID: N/A   Status: Not installed


📚 App Manifest
   Created app manifest for "Incident Response" in "DevRel Sandbox" workspace

🏠 Workspace Install
   Installed "Incident Response" app to "DevRel Sandbox" workspace
   Updated app icon: assets/icon.png
   Finished in 3.5s

🎁 App packaged and ready to deploy
   0.019MB was packaged in 4.1s

🚀 Incident Response deployed in 11.5s
   Dashboard:  https://slack.com/apps/A045X89B***
   App Owner:  hporutiu (U0******)
   Workspace:  DevRel Sandbox (T038J6****)
```

## Step 4. Add Environmental Variables to Slack Cloud

To add the `INCIDENT_CHANNEL` variable to our deployed app, we would run `slack env add INCIDENT_CHANNEL C03V2ED7111` and then hit enter.
You should see the following output:

> Note, I've created an alias for my Slack CLI, `hermes`. `hermes env add` will yeild the same result as `slack env add`.

```bash
hporutiu@hporuti-ltmkkef Incident-Management-Functions % hermes env add INCIDENT_CHANNEL C03V2ED7111
? Choose a workspace devrelsandbox  Team ID: T038J6TH5PF 
   App ID: A045X89BRCK   Status: Installed

 APP  A045X89BRCK
✨  successfully added INCIDENT_CHANNEL to app environment variables
```

Make sure to repeat that process for the rest of the variables.

🎉 Awesome! You are one step away from running your app! 🎉

The last step will be to create a trigger. 

## Step 5. Create the Triggers

https://user-images.githubusercontent.com/10428517/195186528-43d81752-145c-4fd9-8a7f-cbc77cd36778.mp4

After creating your app, you'll need to create a new trigger that will start the
workflow.

```bash
slack trigger create --trigger-def triggers/create-incident-button.json
```

The CLI will ask you to choose a workspace to install your trigger to. Also, it will ask you 
if you want to install it for your dev app, or your prod app. Choose wisely, as the dev version of 
the trigger will only work with `slack run`, and the prod version with `slack deploy`. Let's choose 
the production version for now! Once you've picked a
workspace, you should see output like this:

```
   App ID: A045MHR6SCT   Status: Installed
   Workspace: devrelsandbox      Team ID: T038J6TH5PF


⚡ Trigger created
   Trigger ID:   Ft045S9B0VHR
   Trigger Type: shortcut
   Trigger Name: Create an Incident
   URL: https://slack.com/shortcuts/Ft045W7LGYKG/6374de8cdf66f250deb6335c58b4d04d
```

Great job! Now, let's use that trigger to kick off a workflow!

## Step 6. Run the Workflows and Create an Incident

https://user-images.githubusercontent.com/10428517/195210585-88d78009-e1a7-44a3-8400-cb2c052f42da.mp4

Now, take the URL, and paste it into a channel. It should unfurl with a green button that 
says `Start`, as shown below. That button will kick off your workflow!

Now, click on the `Start` button. Fill out the form, and then hit `Submit` when you are done. You should see an incident created in your 
incident channel, as shown below.

Great job! You've now created a incident via a link trigger! Now, let's move on to show you all of the functionality the app provides.

## Step 7. View Incident Details in Jira and Salesforce

Go ahead and click on the incident replies to see the Jira issue and Salesforce incident that was created. You will need to have set up your account credentials via
the env variables to make sure this works as shown below.

https://user-images.githubusercontent.com/10428517/194969514-9389a152-3bf0-4a80-9bc2-4e8f4d21b76e.mp4

## Step 8. Create Swarming Channel

Next, click on the `Create Channel` button to create a Swarming channel. This will automatically create a Zoom call and start it so that the participants can 
resolve the incident.

https://user-images.githubusercontent.com/10428517/194970092-a269a46c-db89-4a14-b0d7-0d96836ab57b.mp4

## Step 9. Close the Incident
Now that we've solved the incident, it's time to close it! Click on `Close Incident` and add your close notes as shown below.

https://user-images.githubusercontent.com/10428517/194970955-1ff56c8e-5b52-4df4-a455-26db380e7dd4.mp4

Great job! You've now used the power of the Slack Platform to create, swarm, and close an incident all within Slack, while keeping all of your 
records of data updated!

## Step 10. Generate a Report

Lastly, let's generate a report. To do so, we will need to create a trigger by using the following command:

```
slack trigger create --trigger-def triggers/create-new-report-button.json
```

https://user-images.githubusercontent.com/10428517/194971294-f7bf8dbc-7a97-4b14-922f-b34141fb523b.mp4

<!-- 
## Using Webhook Triggers

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
``` -->

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

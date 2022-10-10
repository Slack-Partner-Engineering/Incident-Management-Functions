# ⚠️ Incident-Management-Functions ⚠️

The incident management functions are a set of functions used to optimize the process of incident management within Slack. This project has a few goals:
* Partner agnostic. This means that it should be easy to switch in Jira vs. ServiceNow as your preffered platform to save incident data.
* Highly customizable. You should be able to add in multiple solutions depending on your preffered tech stack.
* Show the power of the Slack platform. All work on the incident stays in Slack, but updates are shared with multiple data sources (i.e. Salesforce, Jira, Zendesk). 

![incmgmtcompressed](https://user-images.githubusercontent.com/10428517/194784689-ab2a39d6-8e98-44a4-a0be-7c48458ce338.gif)

## Getting Started

To install and configure this app on your system, you will need to ensure you have downloaded the [Slack CLI](https://api.slack.com/future/tools/cli).
Once you have downloaded that, you can go ahead and clone this repo.

1. `git clone https://github.com/Slack-Partner-Engineering/Incident-Management-Functions.git`

## Configure the App

Next, you will have to configure your app by setting enviornmental variables. This will enable you to send incident data to your exteral accounts, such as 
Zendesk, Jira, Salesforce, ServiceNow, and others.

1. Go ahead and edit the `.sample.env` file. Rename it to `.env`.
2. Fill in the necessary environmental variables. A completed `.env` file should look like the following:

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

3. Once you've filled the `.env` file, go ahead and save it, and source the changes.
4. Run the `source .env` command to set your variables.

🎉 Nice job, you're now ready to run the app! 🎉

## Running it locally

If you want to run it locally, you will be able to do so using the following command. This is great for development and testing.

```bash
slack run
```

## Deploying to Slack's Hosting

If you want to deploy the app, you will need to add the environmental variables to Slack Cloud. You can do so using the `slack var add` command.
Go ahead and run the following commands to add the env variables to the cloud:

```
$ slack var add INCIDENT_CHANNEL [Ctrl+V] [Enter]
```

So, for example, if my `INCIDENT_CHANNEL` I wanted to use was `C03V2ED7111` I would run:

```
$ slack var add INCIDENT_CHANNEL C03V2ED7111 [Enter]
```

Go ahead and repeat that for all of the variables you plan to use. Once you have added all variables, you can now deploy your app!


```bash
slack deploy
```

Awesome! You are now ready to interact with your app! To do so, we will create a trigger.

## Seeing it in action

After creating your app, you'll need to create a new trigger that will start the
workflow.

```bash
slack trigger create --trigger-def triggers/create-incident-button.json
```

The CLI will ask you to choose a workspace to install your trigger to. Also, it will ask you 
if you want to install it for your dev app, or your prod app. Choose wisely, as the dev version of 
the trigger will only work with `slack run`, and the prod version with `slack deploy`. Once you've picked a
workspace, you should see output like this:

```
   App ID: A045MHR6SCT   Status: Installed
   Workspace: devrelsandbox      Team ID: T038J6TH5PF


⚡ Trigger created
   Trigger ID:   Ft045S9B0VHR
   Trigger Type: shortcut
   Trigger Name: Create an Incident
   URL: https://slack.com/shortcuts/Ft045S9B0VHR/fea203fe37ec662daced1ab4969f730e
```

Now, take the URL, and paste it into a channel. It should unfurl with a green button that 
says `Start`, as shown below. That button will kick off your workflow!

<img width="581" alt="Screen Shot 2022-10-09 at 7 53 59 PM" src="https://user-images.githubusercontent.com/10428517/194785249-bf32dbc2-0c4a-4ee5-8b34-1ce9253566c0.png">

Let's try it out! Go ahead and run `Slack run`. Make sure to choose the same workspace as your trigger.

Now, click on the `Start` button. Fill out the form, and then hit `Submit` when you are done. You should see an incident created in your 
incident channel, as shown below.

<img width="589" alt="Screen Shot 2022-10-09 at 8 00 18 PM" src="https://user-images.githubusercontent.com/10428517/194785424-b9d66452-40d2-45e8-8539-ab1b55f3c377.png">

Great job! You've now created a incident via a link trigger! Now, let's move on to show you how to create an incident via a webhook.

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

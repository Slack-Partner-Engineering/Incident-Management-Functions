//this workflow should deal with an incoming incident from a webhook.
//takes in a stringified json body for now (refactor will take in values later)
//sends the data to the incoming webhook function to normalize the data
//sends the incident management object then to the new incident send to slack function to post the details in channel.
//it will in the future call the inident orchestrator function too to kick off the new incident process.

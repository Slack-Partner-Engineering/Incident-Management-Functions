const createSalesforceIncident = async (incidentInfo: any, env: any) => {
  console.log(incidentInfo);
  const url =
    "https://slack-5a-dev-ed.my.salesforce.com/services/data/v55.0/sobjects/incident__c";

  const body: any = {
    Name: "Slack Created - {source}",
    Incident_Number__c: "INC-4423534423",
    Summary__c: "short description",
    Severity__c: "CRITICAL",
  };

  const auth = `Bearer ${env["ACCESS_TOKEN"]}`;

  const sfResponse: any = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const res = await sfResponse.json();
  const incidentURL = `${env["SALESFORCE_INSTANCE_URL"] + "/" + res.id}`;
  console.log(incidentURL);
  return incidentURL;
};

export { createSalesforceIncident };

// curl https://MyDomainName.my.salesforce.com/services/data/v56.0/sobjects/Account/ -H
//"Authorization: Bearer token" -H "Content-Type: application/json" -d "@newaccount.json"

// // Single record creation
// await conn.sobject("incident__c").create(
//   {
//     Name: "Slack Created - {source}",
//     Incident_Number__c: "INC-4423534423",
//     Summary__c: "short description",
//     Severity__c: "CRITICAL",
//   },
//   await function (err: any, ret: any) {
//     if (err || !ret.success) {
//       return console.error(err, ret);
//     }
//     console.log("Created record id : " + ret.id);
//     console.log(
//       `Object URL ${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
//     );
//     result = {
//       "status": "sucess",
//       url: `${env["SALESFORCE_INSTANCE_URL"] + "/" + ret.id}`,
//       "message": "incident Created!",
//     };
//     return result.url;
//   },
// );

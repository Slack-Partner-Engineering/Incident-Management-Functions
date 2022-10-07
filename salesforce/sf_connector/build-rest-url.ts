const getRestURL = (sfObject: string, env: any) => {
  return `${
    env["SALESFORCE_INSTANCE_URL"]
  }/services/data/v55.0/sobjects/${sfObject}`;
};

export { getRestURL };

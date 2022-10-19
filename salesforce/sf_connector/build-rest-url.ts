const getRestURLPost = (sfObject: string, env: any) => {
  return `${env["SALESFORCE_INSTANCE_URL"]}/services/data/${
    env["SALESFORCE_API_VERSION"]
  }/sobjects/${sfObject}`;
};

const getRestURLPatch = (sfObject: string, env: any, objectId: string) => {
  return `${env["SALESFORCE_INSTANCE_URL"]}/services/data/${
    env["SALESFORCE_API_VERSION"]
  }/sobjects/${sfObject}/${objectId}`;
};

export { getRestURLPatch, getRestURLPost };

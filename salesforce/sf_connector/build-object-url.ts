const getObjectURL = (sfObjectId: string, env: any) => {
  return `${env["SALESFORCE_INSTANCE_URL"] + "/" + sfObjectId}`;
};

export { getObjectURL };

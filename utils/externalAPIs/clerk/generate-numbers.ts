//for now this will be hard coded, update to be dynamic in a future release.
const generateNumbers = (env: any) => {
  const phoneNumbers = env["CLERK_NOTIFICATION_NUMBERS"].split(",");
  return phoneNumbers;
};

export { generateNumbers };

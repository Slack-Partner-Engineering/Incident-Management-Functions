//for now this will be hard coded, update to be dynamic in a future release.
const generateNumbers = (env: any) => {
  if (env["CLERK_NOTIFICATION_NUMBERS"]) {
    const phoneNumbers = env["CLERK_NOTIFICATION_NUMBERS"].split(",");
    return phoneNumbers;
  } else {
    return [];
  }
};

export { generateNumbers };

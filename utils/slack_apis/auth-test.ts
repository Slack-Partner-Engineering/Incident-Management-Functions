const authTest = async (token: string) => {
  const body = "";

  const req = new Request("https://slack.com/api/auth.test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "INCPEHER",
      "Authorization": `Bearer ${token}`,
    },
    body,
  });
  await fetch(req);

  return;
};

export { authTest };

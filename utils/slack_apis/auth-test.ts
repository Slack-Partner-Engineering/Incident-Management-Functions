const authTest = async (token: string) => {
  const body = "";

  try {
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
  } catch (error) {
    console.log(error);
    return;
  }
};

export { authTest };

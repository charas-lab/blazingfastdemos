const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { url, content } = req.body;

  if (!url || !content) {
    res.status(400).send({ error: "url and content are required" });
    return;
  }

  const githubToken = process.env.GITHUB_TOKEN; // Set this environment variable in Vercel
  const fileName = `${url.split("/").pop().split(".")[0]}.html`;

  try {
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${githubToken}`,
      },
      body: JSON.stringify({
        description: "Source code fetched",
        public: false,
        files: {
          [fileName]: {
            content,
          },
        },
      }),
    });

    const responseData = await response.json();
    res.status(200).send({ gistUrl: responseData.html_url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while creating the Gist" });
  }
};

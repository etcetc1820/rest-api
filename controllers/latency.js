const axios = require("axios");

exports.latency = async (req, res) => {
  const beginAt = Date.now();

  const responseLatency = await axios
    .get("https://google.com")
    .then(() => Date.now() - beginAt)
    .catch((error) => res.status(500).json({ message: error.message }));

  res.status(200).json({ latency: `${responseLatency}ms` });
};

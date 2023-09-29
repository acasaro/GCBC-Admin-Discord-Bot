require("dotenv").config();

const config = {
  serverUrl: "Express Backend Host",
};

if (process.env.NODE_ENV === "development") {
  config.serverUrl = process.env.SERVER_URL_DEV;
} else {
  config.serverUrl = process.env.SERVER_URL_LIVE;
}

module.exports = { config };

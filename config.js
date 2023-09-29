require("dotenv").config();

const config = {
  token: "Discord Application Token",
  clientId: "Discord applications client id",
  guildId: "Your development server's id",
  serverUrl: "Your Server domain",
};

if (process.env.NODE_ENV === "development") {
  config.token = process.env.TEST_TOKEN;
  config.clientId = process.env.TEST_CLIENT_ID;
  config.guildId = process.env.TEST_GUILD_ID;
  config.serverUrl = process.env.SERVER_URL_DEV;
} else {
  config.token = process.env.TOKEN;
  config.clientId = process.env.CLIENT_ID;
  config.guildId = process.env.GUILD_ID;
  config.serverUrl = process.env.SERVER_URL_LIVE;
}

module.exports = { config };

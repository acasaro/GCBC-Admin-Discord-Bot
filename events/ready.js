const { Events } = require("discord.js");
// const db = require('../backend/db/models');
const { logSuccess, logError } = require("../common/utility-logging");
const deployCommands = require("../deploy-commands");
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    // const commands = await client.api.applications(client.user.id).commands.get();
    try {
      // deployCommands("1116106510414647326"); //TEST
      // deployCommands("819348511090016257"); //LIVE
    } catch (error) {
      logError("Unable to connect to the database:", error);
    }
    logSuccess(`Ready! Logged in as ${client.user.tag}`);
  },
};

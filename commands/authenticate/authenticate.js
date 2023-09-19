/**
 * @file configureTrackedRoles
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require("discord.js");
const { loadSavedCredentialsIfExist } = require("../../server/firebase");

module.exports = {
  name: "authenticate",
  description: "Authenticate bot with Google API",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("authenticate")
    .setDescription("Authenticate with Google by"),
  async execute(interaction) {
    try {
      const client = await loadSavedCredentialsIfExist();
      console.log(client);

      await interaction.reply({
        content: "test",
        // content: `Authenticate by visiting here: ${discordOAuthUrl}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: "Something went wrong running your command!",
        ephemeral: true,
      });
    }
  },
};

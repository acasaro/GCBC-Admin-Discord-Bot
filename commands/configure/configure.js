/**
 * @file configure
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder, roleMention } = require("discord.js");

module.exports = {
  name: "configure",
  description: "Setup bot configuration for tracking roles",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Setup bot configuration for tracking roles"),
  async execute(interaction) {
    try {
      await require("../../select-menus/TrackRoleSelectMenu").execute(interaction);
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: "Something went wrong running your command!",
        ephemeral: true,
      });
    }
  },
};

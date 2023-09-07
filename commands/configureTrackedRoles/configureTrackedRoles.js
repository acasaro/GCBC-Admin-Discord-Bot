/**
 * @file configureTrackedRoles
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "configure-tracked-roles",
  description: "Setup bot configuration for tracking roles",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("configure-tracked-roles")
    .setDescription("Select roles to track active members assigned to them"),
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

/**
 * @file configureTrackedRoles
 * @type Slash Command
 * @description Example slash command.
 */

const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const { loadSavedCredentialsIfExist, getTrackedRoles } = require("../../server/firebase");

module.exports = {
  name: "sheet-id",
  description: "Set Google sheet ID",
  guildOnly: true,
  data: new SlashCommandBuilder().setName("sheet-id").setDescription("Set Google sheet ID"),
  async execute(interaction) {
    try {
      // Create the modal
      const settings = await getTrackedRoles();
      const modal = new ModalBuilder()
        .setCustomId("edit_sheet_id")
        .setTitle("Edit Google Sheet ID");

      // Create the text input components
      const sheetIdInput = new TextInputBuilder()
        .setCustomId("sheet_id")
        .setLabel("Google Sheet ID:")
        .setStyle(TextInputStyle.Short)
        .setValue(settings?.sheet_id || "");

      const firstActionRow = new ActionRowBuilder().addComponents(sheetIdInput);

      // Add inputs to the modal
      modal.addComponents(firstActionRow);
      // Show the modal to the user
      await interaction.showModal(modal);
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: "Something went wrong running your command!",
        ephemeral: true,
      });
    }
  },
};

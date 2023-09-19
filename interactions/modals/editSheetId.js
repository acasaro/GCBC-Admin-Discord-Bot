const { updateGoogleSheetId } = require("../../server/firebase");

module.exports = {
  id: "edit_sheet_id",
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    try {
      const { guild, channel } = interaction;

      // Get modal input fields
      const sheetId = interaction.fields.getTextInputValue("sheet_id");

      // Update sheet in Firebase
      await updateGoogleSheetId(sheetId);
      return await interaction.reply({
        content: `Now connected to Google Sheet ID: ${sheetId}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: "Something went wrong updating gooogle sheet.",
        ephemeral: true,
      });
    }
  },
};

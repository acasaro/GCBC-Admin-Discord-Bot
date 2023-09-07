/**
 * @name AdminAssignSelect
 * @type Select Menu
 * @description
 */
const { RoleSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  async execute(interaction) {
    try {
      const selectMenu = new RoleSelectMenuBuilder()
        .setCustomId("track_roles_select")
        .setPlaceholder("Select roles")
        .setMinValues(1)
        .setMaxValues(10);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.reply({
        content: "Select up to 10 roles to track.",
        components: [row],
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

/**
 * @file sync
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require("discord.js");
const { getTrackedRoles } = require("../../server/firebase");
const { getSheet, updateValues } = require("../../common/google-sheets");
const { config } = require("../../config");

module.exports = {
  name: "sync-google-sheet",
  description: "Manually sync to Google Sheets",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("sync-google-sheet")
    .setDescription("Manually sync to Google Sheets"),
  async execute(interaction) {
    const { client } = interaction;
    const guildId = interaction.guild.id;
    const guild = await client.guilds.fetch(guildId);
    const roles = await guild.roles.fetch(); // Fetch the latest roles data

    try {
      await guild.members.fetch();
      await guild.roles.fetch();

      const settings = await getTrackedRoles();
      const values = [];
      for (let i = 0; i < settings.tracked_roles.length; i++) {
        const role = settings.tracked_roles[i];
        const roleId = role.discord_role_id;
        const key = role.key;

        // Find members with the specified role
        roles.get(roleId).members.forEach((m) => values.push([key, m.user.tag, m.user.id]));
      }

      const update = await updateValues("Active Clients!A2", "RAW", values);

      if (update == null) {
        return await interaction.reply({
          content: `There is an issue accessing the Google sheet`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Sheet successfully updated!`,
          ephemeral: true,
        });
      }
    } catch (error) {
      // console.log(error.response.statusText);
      if (error?.response?.statusText === "Unauthorized") {
        return await interaction.reply({
          content: `Unauthorized Google API issue`,
          ephemeral: true,
        });
      } else {
        console.log(error);
        return await interaction.reply({
          content: "Something went wrong running your command!",
          ephemeral: true,
        });
      }
    }
  },
};

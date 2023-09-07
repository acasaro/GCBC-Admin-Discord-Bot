/**
 * @file admin-assign
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require("discord.js");
const { getTrackedRoles } = require("../../server/firebase");
// const { getUserRankedRole } = require('../../common/utility-functions');

module.exports = {
  name: "role-lookup",
  description: "look up members assigned to role",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("role-lookup")
    .setDescription("Manually sync to Google Sheets"),
  async execute(interaction) {
    const { client } = interaction;

    const guildId = interaction.guild.id;
    const guild = await client.guilds.cache.get(guildId);

    try {
      await guild.members.fetch();
      const settings = await getTrackedRoles();
      const result = {};

      for (let i = 0; i < settings.tracked_roles.length; i++) {
        const role = settings.tracked_roles[i];
        const roleId = role.discord_role_id;
        const key = role.key;

        // Find members with the specified role
        let getAllRoleMembers = guild.roles.cache
          .get(roleId)
          .members.map((m) => ({ username: m.user.tag, id: m.user.id }));

        result[key] = getAllRoleMembers;
      }
      await interaction.reply({
        content: `Done `,
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

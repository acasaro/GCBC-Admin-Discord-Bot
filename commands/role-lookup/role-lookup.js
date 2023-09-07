/**
 * @file admin-assign
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require("discord.js");
// const { getUserRankedRole } = require('../../common/utility-functions');

const currentCoaches = [
  { name: "Active Students Curtis", id: "1089971869471481996", key: "curtis" },
  { name: "Active Students Puf", id: "1101518858298331247", key: "puf" },
  { name: "Active Students Nytro", id: "1089973607960154283", key: "nytro" },
  { name: "Active Students Comp", id: "1089973854987882617", key: "comp" },
];

module.exports = {
  name: "role-lookup",
  description: "look up members assigned to role",
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName("role-lookup")
    .setDescription("Lookup members assigned to role"),
  async execute(interaction) {
    const { client } = interaction;

    const guildId = interaction.guild.id;
    const guild = await client.guilds.cache.get(guildId);

    try {
      await guild.members.fetch();

      const result = {};

      for (let i = 0; i < currentCoaches.length; i++) {
        const currentRole = currentCoaches[i];
        const roleId = currentRole.id;
        const key = currentRole.key;

        // Find members with the specified role
        let getAllRoleMembers = guild.roles.cache
          .get(roleId)
          .members.map((m) => ({ username: m.user.tag, id: m.user.id }));

        result[key] = getAllRoleMembers;
      }
      console.log(JSON.stringify(result));
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

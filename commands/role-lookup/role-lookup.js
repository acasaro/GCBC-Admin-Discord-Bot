/**
 * @file admin-assign
 * @type Slash Command
 * @description Example slash command.
 */

const { SlashCommandBuilder } = require('discord.js');
// const { getUserRankedRole } = require('../../common/utility-functions');

module.exports = {
  name: 'role-lookup',
  description: 'look up members assigned to role',
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setName('role-lookup')
    .setDescription('Lookup members assigned to role'),
  async execute(interaction) {
    const { guild } = interaction;
    try {
      const roleName = '1030245980014129182';

      // Find the role by name
      const role = guild.roles.cache.find(r => r.id === roleName);

      if (!role) {
        interaction.reply({ content: 'Role not found.', ephemeral: true });
        return;
      }

      // Count members with the specified role
      const membersWithRole = guild.members.cache.filter(member =>
        member.roles.cache.has(role.id),
      );
      console.log(membersWithRole.map(item => item?.user?.username));
      // Send the count to the channel
      interaction.reply({
        content: `The number of members with the ${roleName} role is ${membersWithRole.size}`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return await interaction.reply({
        content: 'Something went wrong running your command!',
        ephemeral: true,
      });
    }
  },
};

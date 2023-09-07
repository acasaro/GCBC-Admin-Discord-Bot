const { roleMention } = require("discord.js");
const { setTrackedRoles } = require("../../server/firebase");
const { snakeCase } = require("lodash");

/**
 * @name TrackRoleSelect
 * @type Select Menu - Interaction
 * @description
 */

module.exports = {
  id: "track_roles_select",
  async execute(interaction) {
    const { client } = interaction;
    const guildId = interaction.guild.id;
    const guild = await client.guilds.cache.get(guildId);

    try {
      const noReply = await interaction.deferUpdate();

      const selectedRoles = interaction?.values;

      // console.log(selectedRoles);

      const trackedRoles = selectedRoles.map((role) => {
        const roleData = guild.roles.cache.get(role);
        return {
          name: roleData?.name,
          discord_role_id: roleData?.id,
          key: snakeCase(roleData?.name),
        };
      });

      // Update Firebase
      await setTrackedRoles(trackedRoles);

      await interaction.editReply({
        content: `I've setup to track members assigned to these roles:\n ${selectedRoles
          .map((role) => roleMention(role))
          .join(",\n ")} `,
        components: [],
        ephemeral: true,
      });
    } catch (error) {
      await interaction.editReply({
        content: `There was an issue assigning admin. \nError catch: \n\`\`\` ${error}\n\`\`\``,
        components: [],
      });
      console.log(error);
    }
  },
};

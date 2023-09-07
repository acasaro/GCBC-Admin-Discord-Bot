const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const guild = interaction.guild;
    const { user } = interaction;

    if (!guild) {
      await interaction.reply({
        content: "This command can only be used in a server (guild).",
        ephemeral: true,
      });
      return;
    }

    // Check if the user who issued the command has the "ADMINISTRATOR" permission
    if (
      guild.members.cache.get(user.id)?.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      // User has admin permission, continue with the command logic

      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
          console.error(`No command matching ${interaction.commandName} was found.`);
          return;
        }

        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(`Error executing ${interaction.commandName}`);
          console.error(error);
        }
      }
    } else {
      // User does not have admin permission, send a denial message
      await interaction.reply({
        content: "You do not have permission to use this bot.",
        ephemeral: true,
      });
    }
  },
};

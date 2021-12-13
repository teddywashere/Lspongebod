const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('(STAFF)')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('(STAFF) Add a role to yourself or a user, no target if you want to add it to yourself')
				.addRoleOption(options => options.setName('role').setDescription('The role to add').setRequired(true))
				.addUserOption(options => options.setName('target').setDescription('The user to add the role to')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('(STAFF) Remove a role from yourself or a user,no target if you want to remove it from youself')
				.addRoleOption(options => options.setName('role').setDescription('The role to remove').setRequired(true))
				.addUserOption(options => options.setName('target').setDescription('The user to remove the role from')),
		),
	async execute(interaction) {
		try {
			// ADD ROLE
			if (interaction.options.getSubcommand() === 'add') {
				await interaction.reply({ content: `Adding role...`, ephemeral: true });

				const adding = require('./Role/RoleAdd');

				if (!adding) return interaction.editReply({ content: `I couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (adding) return adding.execute(interaction);
			}

			// REMOVE ROLE
			if (interaction.options.getSubcommand() === 'remove') {
				await interaction.reply({ content: `Removing role...`, ephemeral: true });

				const removing = require('./Role/RoleRemove');

				if (!removing) return interaction.editReply({ content: `I couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (removing) return removing.execute(interaction);
			}
		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
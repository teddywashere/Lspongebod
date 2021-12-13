const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('(STAFF) Warn a member')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('member')
				.setDescription('(STAFF) Warn a member')
				.addUserOption(option => option.setName('member').setDescription('The member to warn').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('The reason for the warn').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('showall')
				.setDescription('(STAFF) Show all warns of a member or user')
				.addUserOption(option => option.setName('member').setDescription('The member to show all warns of'))
				.addStringOption(option => option.setName('id').setDescription('The userID to show all warns of')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('(STAFF) Edit a member or users warn')
				.addStringOption(option => option.setName('reason').setDescription('The reason for editing the warn').setRequired(true))
				.addNumberOption(option => option.setName('warn').setDescription('The number of the warn you want to edit').setRequired(true))
				.addStringOption(option => option.setName('edit').setDescription('The new reason for that warn').setRequired(true))
				.addUserOption(option => option.setName('member').setDescription('The member to edit the warn of'))
				.addStringOption(option => option.setName('id').setDescription('The userID to edit the warn of')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('(STAFF) Remove a warn from a member')
				.addUserOption(option => option.setName('member').setDescription('The member to remove the warn from').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('The reason for removing the warn').setRequired(true)),
		),

	async execute(interaction) {
		try {
			// WARN A MEMBER
			if (interaction.options.getSubcommand() === 'member') {
				await interaction.reply({ content: `Warning...`, ephemeral: true });

				const warning = require('./Warn/WarnMember');

				if (!warning) return interaction.editReply({ content: `I'm sorry i couldn't find the executable. My bad.`, ephemeral: true });
				if (warning) return warning.execute(interaction);
			}

			// 	SHOW ALL WARNS
			if (interaction.options.getSubcommand() === 'showall') {
				await interaction.reply({ content: `Searching...`, ephemeral: true });

				const showall = require('./Warn/WarnShowall');

				if (!showall) return interaction.editReply({ content: `I'm sorry i couldn't find the executable. My bad.`, ephemeral: true });
				if (showall) return showall.execute(interaction);
			}

			// EDIT A WARN
			if (interaction.options.getSubcommand() === 'edit') {
				await interaction.reply({ content: `Editing...`, ephemeral: true });

				const editing = require('./Warn/WarnEdit');

				if (!editing) return interaction.editReply({ content: `I'm sorry i couldn't find the executable. My bad.`, ephemeral: true });
				if (editing) return editing.execute(interaction);
			}

			// 	REMOVE A WARN
			if (interaction.options.getSubcommand() === 'remove') {
				await interaction.reply({ content: 'Removing...', ephemeral: true });

				const removing = require('./Warn/WarnRemove');

				if (!removing) return interaction.editReply({ content: `I'm sorry i couldn't find the executable. My bad.`, ephemeral: true });
				if (removing) return removing.execute(interaction);
			}

		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
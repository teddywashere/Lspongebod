const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('(STAFF) Ban a member either by tagging them (target) or giving me their id.')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('member')
				.setDescription('(STAFF) The server member to ban')
				.addStringOption(option => option.setName('reason').setDescription('The reason for being banned').setRequired(true))
				.addUserOption(option => option.setName('member').setDescription('The member to ban').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('id')
				.setDescription('(STAFF) The user id to ban')
				.addStringOption(option => option.setName('reason').setDescription('The reason for being banned').setRequired(true))
				.addStringOption(option => option.setName('id').setDescription('The id of the user to ban').setRequired(true)),
		),

	async execute(interaction) {
		try {

			// TARGET
			if (interaction.options.getSubcommand() === 'member') {
				await interaction.reply({ content: `Banning...`, ephemeral: true });

				const target = require('./Ban/BanMember');

				if (!target) return interaction.editReply({ content: `Couln't find that executable... Sorry!`, ephemeral: true });
				if (target) return target.execute(interaction);
			}

			// ID
			if (interaction.options.getSubcommand() === 'id') {
				await interaction.reply({ content: `Banning...`, ephemeral: true });

				const id = require('./Ban/BanId');

				if (!id) return interaction.editReply({ content: `Couldn't find that executable... Sorry!`, ephemeral: true });
				if (id) return id.execute(interaction);
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
		}

	},
};
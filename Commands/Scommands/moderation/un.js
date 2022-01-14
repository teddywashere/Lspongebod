const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('un')
		.setDescription('(STAFF)')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('mute')
				.setDescription('(STAFF) Unmute a member')
				.addUserOption(option => option.setName('member').setDescription('Member to unmute').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('Reason for unmute').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('jail')
				.setDescription('(STAFF) Get a member out of jail')
				.addUserOption(option => option.setName('member').setDescription('Member to release').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('Reason for release').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('(STAFF) Unban a user')
				.addStringOption(option => option.setName('id').setDescription('UserID of the user to unban').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('Reason for unban').setRequired(true)),
		),
	async execute(interaction) {
		try {
			// UNMUTE A MEMBER
			if (interaction.options.getSubcommand() === 'mute') {
				await interaction.reply({ content: `Unmuting...`, ephemeral: true });

				const unmuting = require('./Un/UnMute');

				if (unmuting) return unmuting.execute(interaction);
			}

			// UNJAIL A USER
			if (interaction.options.getSubcommand() === 'jail') {
				await interaction.reply({ content: `Filing paperwork...`, ephemeral: true });

				const releasing = require('./Un/UnJail');

				if (releasing) return releasing.execute(interaction);
			}

			// UNBAN A USER
			if (interaction.options.getSubcommand() === 'ban') {
				await interaction.reply({ content: `Unbanning...`, ephemeral: true });

				const unbanning = require('./Un/UnBan');

				if (!unbanning) return interaction.editReply({ content: `Couldn't find that executable... Sorry!`, ephemeral: true });
				if (unbanning) return unbanning.execute(interaction);
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('(ADMIN) Dm a member')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('target').setDescription('The user to dm').setRequired(true))
		.addStringOption(option => option.setName('content').setDescription('The dm to send').setRequired(true)),
	async execute(interaction) {
		try {
			interaction.reply({ content: 'typing...', ephemeral: true });

			const dm = await interaction.options.getString('content');
			const target = await interaction.options.getUser('target');

			// dm and catch
			await target.send(`${dm}`).catch(O_o => {
				console.log(O_o);
				return interaction.followUp({ content: `Couldn't send the message. ${target} probably has their dms closed...`, ephemeral: true });
			});

			return interaction.editReply({ content: `Dm send to ${target}`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
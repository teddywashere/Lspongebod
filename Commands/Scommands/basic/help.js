/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all commands')
		.setDefaultPermission(false),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Making list...`, ephemeral: true });
			const list = require('./Help/main');

			return list.execute(interaction);
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.FollowUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
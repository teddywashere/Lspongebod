const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('The amount of time it takes for the bot to respond')
		.setDefaultPermission(false),
	async execute(interaction) {
		try {
			await interaction.reply({ content: 'pinging...', ephemeral: true });
			await interaction.editReply({ content: `${Date.now() - interaction.createdTimestamp} ms`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};

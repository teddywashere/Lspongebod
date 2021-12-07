module.exports = {
	async execute(interaction) {
		try {
			return interaction.reply({ content: `I will say any message you want me to.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
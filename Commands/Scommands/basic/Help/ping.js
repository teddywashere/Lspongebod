module.exports = {
	async execute(interaction) {
		try {
			return interaction.reply({ content: `Ping returns the approximate time I take for one roundtrip.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
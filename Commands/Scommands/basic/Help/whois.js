module.exports = {
	async execute(interaction) {
		try {
			return interaction.reply({ content: `You can get information on either a member of this server, or a user by giving me their ID`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
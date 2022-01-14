const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const error = await interaction.options.getChannel('errorchannel');
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (server) {
				await server.update({ error_channel: error.id });
				await server.update({ owner_id: interaction.guild.ownerId });
				return interaction.editReply({ content: `Error channel and ownership settings updated`, ephemeral: true });
			}
			if (!server) {
				await Setup.create({
					guild_id: interaction.guild.id,
					owner_id: interaction.guild.ownerId,
					error_channel: error.id,
				});
				return interaction.editReply({ content: `Error channel set up. Please set admin, staff and member roles and run /setup finish to get the basic bot features.`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
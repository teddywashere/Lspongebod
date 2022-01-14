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
			const prefix = await interaction.options.getString('prefix');
			const coowner = await interaction.options.getUser('co-owner');
			const opentickets = await interaction.options.getChannel('opentickets');
			const closedtickets = await interaction.options.getChannel('closedtickets');
			const ticketname = await interaction.options.getString('ticketname');
			const backup = await interaction.options.getString('backup');
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first`, ephemeral: true });
			if (!prefix && !coowner && !opentickets && !closedtickets && !ticketname && !backup) return interaction.editReply({ content: `Please add at least one setup option`, ephemeral: true });

			if (server) {
				if (prefix) {
					await server.update({ prefix: prefix });
				}
				if (coowner) {
					await server.update({ co_owner: coowner.id });
				}
				if (opentickets) {
					await server.update({ ticketopen_channel: opentickets.id });
				}
				if (closedtickets) {
					await server.update({ ticketclose_channel: closedtickets.id });
				}
				if (backup) {
					await server.update({ server_template: backup });
				}
				return interaction.editReply({ content: `Other settings set`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
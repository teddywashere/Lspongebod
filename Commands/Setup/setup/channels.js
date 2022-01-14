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
			const modlog = await interaction.options.getChannel('modlog');
			const logs =  await interaction.options.getChannel('logs');
			const tickets =  await interaction.options.getChannel('tickets');
			const criminals =  await interaction.options.getChannel('publicmodlog');
			const jail =  await interaction.options.getChannel('jail');
			const general =  await interaction.options.getChannel('general');
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) {
				return interaction.editReply({ content: `Please do /setup error first`, ephemeral: true });
			}
			if (!modlog && !logs && !tickets && !criminals && !jail && !general) return interaction.editReply({ content: `Please add at least one channel option`, ephemeral: true });
			
			if (server) {

				if (modlog) {
					await server.update({ modlog_channel: modlog.id });
				}
				if (logs) {
					await server.update({ logs_channel: logs.id });
				}
				if (tickets) {
					await server.update({ tickets_channel: tickets.id });
				}
				if (criminals) {
					await server.update({ criminals_channel: criminals.id });
				}
				if (jail) {
					await server.update({ jail_channel: jail.id });
				}
				if (general) {
					await server.update({ general_chat: general.id });
				}
				return interaction.editReply({ content: `Done setting up channels`, ephemeral: true });
			}


		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

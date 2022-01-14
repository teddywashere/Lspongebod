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
			const muted =  await interaction.options.getRole('muted');
			const admin = await interaction.options.getRole('admin');
			const staff = await interaction.options.getRole('staff');
			const everyone = await interaction.options.getString('everyone');
			const member = await interaction.options.getRole('member');
			const jail = await interaction.options.getRole('jail');
			const chatreviver = await interaction.options.getRole('chatreviver');
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) {
				return interaction.editReply({ content: `Please do /setup error first`, ephemeral: true });
			}
			if (!muted && !admin && !staff && !everyone && !member && !jail && !chatreviver) return interaction.editReply({ content: `Please add at least one role option`, ephemeral: true });

			if (server) {
				if (muted) {
					await server.update({ mute_role: muted.id });
				}
				if (admin) {
					await server.update({ admin_role: admin.id });
				}
				if (staff) {
					await server.update({ staff_role: staff.id });
				}
				if (everyone) {
					await server.update({ everyone_role: everyone });
				}
				if (member) {
					await server.update({ member_role: member.id });
				}
				if (jail) {
					await server.update({ jail_role: jail.id });
				}
				if (chatreviver) {
					await server.update({ chatreviver_role: chatreviver.id });
				}
				return interaction.editReply({ content: `Done setting up roles`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const role = await interaction.options.getRole('role');
			const target = await interaction.options.getUser('member');
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);

			if (target) {
				const member = await interaction.guild.members.cache.get(target.id);
				if (!member.roles.cache.has(role.id)) return interaction.editReply({ content: `Member doesn't have that role`, ephemeral: true });

				await member.roles.remove(role);

				const targetembed = new Discord.MessageEmbed()
					.setTitle(':outbox_tray:**Role Removed**:outbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\`\n\n**Removed by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n_ _`)
					.setThumbnail(target.displayAvatarURL())
					.setColor('#f84084')
					.setTimestamp();

				if(logs) logs.send({ embeds: [targetembed] }).catch(O_o => {});

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role removed in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} removed a role from you\n_ _`)
					.setColor('#f84084')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {});
				return interaction.editReply({ content: `Removed ${role} from ${target}`, ephemeral: true });
			}
			if (!target) {
				if (!author.roles.cache.has(role.id)) return interaction.editReply({ content: `You don't have that role`, ephemeral: true });

				await author.roles.remove(role);

				const authorembed = new Discord.MessageEmbed()
					.setTitle(':outbox_tray:**Role Removed**:outbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Removed by:** ${interaction.user.tag}\n_ _`)
					.setThumbnail(author.displayAvatarURL())
					.setColor('#f84084')
					.setTimestamp();

				if(logs) logs.send({ embeds: [authorembed] }).catch(O_o => {});
				return interaction.editReply({ content: `Removed the ${role} role from you.`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

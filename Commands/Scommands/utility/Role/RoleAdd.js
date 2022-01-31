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
				if (member.roles.cache.has(role.id)) return interaction.editReply({ content: `Member already has that role`, ephemeral: true });

				await member.roles.add(role);

				const targetembed = new Discord.MessageEmbed()
					.setTitle(':inbox_tray:**Role Added**:inbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\`\n\n**Added by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n_ _`)
					.setThumbnail(target.displayAvatarURL())
					.setColor('#00ffac')
					.setTimestamp();

				if(logs) logs.send({ embeds: [targetembed] }).catch(O_o => {});

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role added in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} gave you a role\n_ _`)
					.setColor('#00ffac')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {});
				return interaction.editReply({ content: `Added ${role} to ${target}`, ephemeral: true });
			}

			// add role to author
			if (!target) {
				if (author.roles.cache.has(role.id)) return interaction.editReply({ content: `You already have that role`, ephemeral: true });

				await author.roles.add(role);

				const authorembed = new Discord.MessageEmbed()
					.setTitle(':inbox_tray:**Role Added**:inbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Added by:** ${interaction.user.tag}\n_ _`)
					.setThumbnail(author.displayAvatarURL())
					.setColor('#00ffac')
					.setTimestamp();

				if(logs) logs.send({ embeds: [authorembed] }).catch(O_o => {});
				return interaction.editReply({ content: `Gave you the ${role} role.`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

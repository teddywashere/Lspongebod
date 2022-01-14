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
			if (!author.permissions.has('BAN_MEMBERS')) return interaction.editReply({ content: `You don't have the ban members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);

			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.guild.members.cache.get(target.id);

			if (interaction.user.id === target.id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
			if (target.id === server.client_id) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });

			// ban target
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You were banned from ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await target.send({ embeds: [dmembed] }).catch((O_o) => {});
			const rip = target.id;
			await member.ban({ days: 7, reason: reason });

			// modlog
			const targetembed = new Discord.MessageEmbed()
				.setTitle(`:name_badge:**Member Banned**:name_badge:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${rip}\`\n\n**Banned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [targetembed] }).catch(O_o => {});

			// criminals
			const ripcrime = new Discord.MessageEmbed()
				.setTitle(`**\`${rip}\` has been banned** `)
				.setDescription(`**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
				.setTimestamp();

			if(criminals) criminals.send({ embeds: [ripcrime] }).catch(O_o => {});

			// reply
			return interaction.editReply({ content: `\`${rip}\` has been banned`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
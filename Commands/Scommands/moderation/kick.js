/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('(STAFF) Kick a member.')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('member').setDescription('The member to kick').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason for being kicked').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Kicking...`, ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });
			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);

			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const member = await interaction.guild.members.cache.get(target.id);

			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });
			if (interaction.user.id === target.id) return interaction.editReply({ content: "You can't kick yourself, dummy!", ephemeral: true });
			if (target.id === server.client_id) return interaction.editReply({ content: "Sorry mate but I can't kick myself.", ephemeral: true });

			// kick offender
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You were kicked from ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff6800')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			const rip = target.id;
			await target.send({ embeds: [dmembed] }).catch((O_o) => {});
			await interaction.guild.members.kick(rip);

			// send modlog
			const kickembed = new Discord.MessageEmbed()
				.setTitle(':anger:**Member Kicked**:anger:')
				.setColor('#ff6800')
				.setThumbnail(target.displayAvatarURL())
				.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\` \n \n**Kicked by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\` \n \n**Reason:** ${reason}\n_ _`)
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [kickembed] }).catch(O_o => {});

			// send Criminals
			const ripembed = new Discord.MessageEmbed()
				.setTitle(`**\`${rip}\` has been kicked**`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff6800')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911659304443072612/c2823fe7a42bd0d578302c185bc241d0b32a4877a36008c36f2dbe47606ae717.jpg')
				.setTimestamp();

			if(criminals) criminals.send({ embeds: [ripembed] }).catch(O_o => {});

			// reply
			return interaction.editReply({ content: `${target.username} has been kicked.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
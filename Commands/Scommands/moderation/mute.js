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
const Mute = require('../../../DatabaseModels/jailmute')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('(STAFF) Mutes a member')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('member').setDescription('Member to mute').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for mute').setRequired(true)),
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			await interaction.reply({ content: `Muting...`, ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });
	
			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);
			const muterole = await interaction.guild.roles.cache.get(server.mute_role);
			const member = await interaction.guild.members.cache.get(target.id);

			if (!muterole) return interaction.editReply({ content: 'Muted role not found.', ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });
			if (member.roles.cache.has(server.mute_role)) return interaction.editReply({ content: `${target} is already muted.`, ephemeral: true });
			if (target.id === interaction.user.id) return interaction.editReply({ content: `You can't mute yourself, dummy!`, ephemeral: true });
			if (target.id === server.client_id) return interaction.editReply({ content: `I can't mute myself...`, ephemeral: true });

			await member.roles.add(muterole);
			const jailmute = await Mute.findOne({ where: { user_id: target.id, guild_id: interaction.guild.id }});
			if (jailmute) await jailmute.update({mute_status: 'true'});
			if (!jailmute) await Mute.create({
				user_id: target.id,
				guild_id: interaction.guild.id,
				mute_status: 'true',
			});

			// send modlog, criminals and interaction reply
			const muteembed = new Discord.MessageEmbed()
				.setTitle(`:zipper_mouth:**Member Muted**:zipper_mouth:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\`\n\n**Muted by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You've been muted in ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			const crimeembed = new Discord.MessageEmbed()
				.setTitle(`**Member Muted**`)
				.setDescription(`${target} got muted.\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911660900677718016/3ipz0r.jpg')
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [muteembed] }).catch(O_o => {});
			if(criminals) criminals.send({ embeds: [crimeembed] }).catch(O_o => {});
			await target.send({ embeds: [dmembed] }).catch((O_o) => {});

			return interaction.editReply({ content: `${target} has been muted`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
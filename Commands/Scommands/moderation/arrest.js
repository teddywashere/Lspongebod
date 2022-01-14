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
const Jail = require('../../../DatabaseModels/jailmute')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arrest')
		.setDescription('(STAFF) Send em to jail!')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('member').setDescription('The member to arrest').setRequired(true)),
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			await interaction.reply({ content: `Arresting...`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const target = await interaction.options.getUser('member');
			const member = await interaction.guild.members.cache.get(target.id);

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);
			const jail = await interaction.guild.channels.cache.get(server.jail_channel);
			if (!jail) return interaction.channel.send('You need to setup a jail for this to work');

			if (!interaction.guild.roles.cache.get(server.jail_role)) return interaction.editReply({ content: `Jail role not found`, ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I won't let you do that.`, ephemeral: true });
			if (member.roles.cache.has(server.jail_role)) return interaction.editReply({ content: `${target} is already in jail`, ephemeral: true });

			await member.roles.remove(member.roles.cache);
			await member.roles.add(server.jail_role);

			const jailmute = await Jail.findOne({ where: { user_id: target.id, guild_id: interaction.guild.id }});
			if (jailmute) await jailmute.update({jail_status: 'true'});
			if (!jailmute) await Jail.create({
				user_id: target.id,
				guild_id: interaction.guild.id,
				jail_status: 'true',
			});
	
			const crimembed = new Discord.MessageEmbed()
				.setTitle(`**\`${target.id}\` has been jailed**`)
				.setDescription(`_ _\n**Reason:** Treason\n_ _`)
				.setColor('#ee0082')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911697939435487232/tumblr_njtmof72q51unlqeso1_1280.png')
				.setTimestamp();

			if (member.roles.cache.has(server.member_role)) { if(criminals) criminals.send({ embeds: [crimembed ] }).catch(O_o => {}); }

			const ageembed = new Discord.MessageEmbed()
				.setTitle(`**__We suspect you to not meet the minimum age requirement of 18 years old.__**`)
				.setDescription('_ _')
				.addField('We need:', `1) A selfie of you holding a piece of paper with your Discord tag, the server name and the date.`, true)
				.addField('And:', `2) A clear picture of your ID with everything blurred out appart from the photo and date of birth.`, true)
				.addField('Where to send it to:', `Please type **__lsb verify__** to open a private ticket and send the pictures inside your private ticket\n\n**If you fail to do so within 48h we will ban you.**`, true)
				.setColor('#ee0082')
				.setThumbnail('https://media.discordapp.net/attachments/772471934231117834/911718877988286464/3d8.jpg?width=661&height=661')
				.setTimestamp();

			await jail.send({ content: `${target} **Verify your age!**`, embeds: [ageembed] }).catch(O_o => {});

			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You need to verify you age in ${interaction.guild}!`)
				.setDescription(`_ _\nMinimum Age Requirement: 18 years old.\n_ _`)
				.setColor('#ee0082')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await target.send({ embeds: [dmembed] }).catch(O_o => {});

			const modembed = new Discord.MessageEmbed()
				.setTitle(`:chains: **Member jailed** :chains:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\`\n\n**Jailed by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n_ _`)
				.setColor('#ee0082')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [modembed] }).catch(O_o => {});

			return interaction.editReply({ content: `${target} jailed`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
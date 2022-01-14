/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
const Discord = require('discord.js');
const { modlogc, criminalsc, errorc } = require('../../../../config.json');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Warns = require('../../../../DatabaseModels/Warns')(sequelize, Sequelize);
const Setup = require('../../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminal_channel);
			const member = await interaction.guild.members.cache.get(target.id);
			if (member.roles.highest.position > author.roles.highest.position) return interaction.editReply({ content: `I won't let you do that`, ephemeral: true });

			const userwarns = await Warns.findAll({ where: { user_id: target.id, guild_id: interaction.guild.id } });
			const warnmap = await userwarns.map(w => w.user_id);

			// FIRST WARN
			if (warnmap.length === 0) {
				const number = '1';

				await Warns.create({
					guild_id: interaction.guild.id,
					user_id: target.id,
					warn: number,
					reason: reason,
				});

				const memberembed = new Discord.MessageEmbed()
					.setTitle(`You have been warned in ${interaction.guild}`)
					.setDescription(`${interaction.user} has warned you\n\n**Reason:** ${reason}\n\nThis is your __first__ warn.`)
					.setColor('#f04cf8')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				const criminalsembed = new Discord.MessageEmbed()
					.setTitle(`**Member Warned**`)
					.setDescription(`${target} has been warned\n\n**Reason:** ${reason}\n\n**Warn count:** \`1\`\n_ _`)
					.setColor('#f04cf8')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/916442419992621067/979-1.png')
					.setTimestamp();

				const modlogembed = new Discord.MessageEmbed()
					.setTitle(':warning:**Member Warned**:warning:')
					.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** \`${target.tag}\`\n\n**ID:** \`${target.id}\`\n\n**Warned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
					.setColor('#f04cf8')
					.setThumbnail(target.displayAvatarURL())
					.setFooter('Warn count: 1');

				await member.send({ embeds: [memberembed] }).catch(O_o => {});
				if(criminals) criminals.send({ embeds: [criminalsembed] }).catch(O_o => {});
				if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

				return interaction.editReply({ content: `Warned ${target}\nThis was their first warn.`, ephemeral: true });
			}

			// SECOND WARN
			if (warnmap.length === 1) {
				const number = 2;

				await Warns.create({
					guild_id: interaction.guild.id,
					user_id: target.id,
					warn: number,
					reason: reason,
				});

				const memberembed = new Discord.MessageEmbed()
					.setTitle(`You have been warned in ${interaction.guild}`)
					.setDescription(`${interaction.user} has warned you\n\n**Reason:** ${reason}\n\nThis is your __${number}__ warn.`)
					.setColor('#f04cf8')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				const criminalsembed = new Discord.MessageEmbed()
					.setTitle(`**Member Warned**`)
					.setDescription(`${target} has been warned\n\n**Reason:** ${reason}\n\n**Warn count:** \`${number}\`\n_ _`)
					.setColor('#f04cf8')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/916442419992621067/979-1.png')
					.setTimestamp();

				const modlogembed = new Discord.MessageEmbed()
					.setTitle(':warning:**Member Warned**:warning:')
					.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** \`${target.tag}\`\n\n**ID:** \`${target.id}\`\n\n**Warned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
					.setColor('#f04cf8')
					.setThumbnail(target.displayAvatarURL())
					.setFooter(`Warn count: ${number}`);

				await member.send({ embeds: [memberembed] }).catch(O_o => {});
				if(criminals) criminals.send({ embeds: [criminalsembed] }).catch(O_o => {});
				if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

				return interaction.editReply({ content: `Warned ${target}\nThis was their second warn.`, ephemeral: true });
			}

			if (warnmap.length === 2) {
				const number = 3;

				await Warns.create({
					guild_id: interaction.guild.id,
					user_id: target.id,
					warn: number,
					reason: reason,
				});

				const memberembed = new Discord.MessageEmbed()
					.setTitle(`**You are banned from ${interaction.guild}**`)
					.setDescription(`_ _\n**Reason:** You have been warned 2 times already.\n_ _`)
					.setColor('#ff0052')
					.setTimestamp();

				const modlogembed = new Discord.MessageEmbed()
					.setTitle(`:name_badge:**Member Banned**:name_badge:`)
					.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${target.id}\`\n\n**Banned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** They have been warned three times.\nReason for their last warn: \`${reason}\`\n_ _`)
					.setColor('#ff0052')
					.setThumbnail(target.displayAvatarURL())
					.setTimestamp();

				const criminalsembed = new Discord.MessageEmbed()
					.setTitle(`\`${target.id}\` **has been banned**`)
					.setDescription(`_ _\n**Reason:** They have been warned three times.\nThe reason for their last warn: \`${reason} \`\n_ _`)
					.setColor('#ff0052')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
					.setTimestamp();

				await member.send({ embeds: [memberembed] }).catch(O_o => {});
				await interaction.guild.members.ban(target.id, { reason: reason });

				if(criminals) criminals.send({ embeds: [criminalsembed] }).catch(O_o => {});
				if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

				return interaction.editReply({ content: `${target.tag} has been banned because this was their third warn`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

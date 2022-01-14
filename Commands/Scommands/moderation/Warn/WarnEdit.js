/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

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

			const reason = interaction.options.getString('reason');
			const number = interaction.options.getNumber('warn');
			const edit = interaction.options.getString('edit');
			const target = interaction.options.getUser('member');
			const id = interaction.options.getString('id');
			const modlog = interaction.guild.channels.cache.get(server.modlog_channel);
			if (!target && !id) return interaction.editReply({ content: `You have to choose either a member or a user id!`, ephemeral: true });

			// MEMBER
			if (target) {
				const userwarns = await Warns.findAll({ where: { user_id: target.id, guild_id: interaction.guild.id } });
				const first = userwarns.find(warn => warn.warn === 1);
				const second = userwarns.find(warn => warn.warn === 2);

				if (!first) return interaction.editReply({ content: 'This member has never been warned.', ephemeral: true });

				if (!second) {
					if (number === 2) return interaction.editReply({ content: `This member only has 1 warn.`, ephemeral: true });
					if (number != 1 && number != 2) return interaction.editReply({ content: `Please put a valid warn number (either 1 or 2)`, ephemeral: true });
					const oldreason = first.reason;

					await first.update({ reason: edit });

					const modlogembed = new Discord.MessageEmbed()
						.setTitle(`:pencil:Warn edited:pencil:`)
						.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
						.setColor('#a260ff')
						.setThumbnail(target.displayAvatarURL())
						.setTimestamp();
					if (modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

					return interaction.editReply({ content: `${target}s ${number} warn edited successfully!`, ephemeral: true });
				}

				if (second) {
					if (number != 1 && number != 2) return interaction.editReply({ content: `Please put a valid warn number (either 1 or 2)`, ephemeral: true });
					if (number === 1) {
						const oldreason = first.reason;

						await first.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(target.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${target}s ${number} warn edited successfully!`, ephemeral: true });
					}
					if (number === 2) {
						const oldreason = second.reason;

						await second.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(target.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${target}s ${number} warn edited successfully!`, ephemeral: true });
					}
				}
			}
			if (id) {
				const user = await client.users.fetch(id);
				if (!user) return interaction.editReply({ content: `Couldn't find that user`, ephemeral: true });
				const userwarns = await Warns.findAll({ where: { user_id: id, guild_id: interaction.guild.id } });
				const first = userwarns.find(warn => warn.warn === 1);
				const second = userwarns.find(warn => warn.warn === 2);
				const third = userwarns.find(warn => warn.warn === 3);

				if (number != 1 && number != 2 && number != 3) return interaction.editReply({ content: `Please put a valid warn number (either 1, 2 or 3)`, ephemeral: true });
				if (!first) return interaction.editReply({ content: 'This member has never been warned.', ephemeral: true });

				if (!second) {
					if (number === 2 || number === 3) return interaction.editReply({ content: `This user only has 1 warn.`, ephemeral: true });

					const oldreason = first.reason;

					await first.update({ reason: edit });

					const modlogembed = new Discord.MessageEmbed()
						.setTitle(`:pencil:Warn edited:pencil:`)
						.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
						.setColor('#a260ff')
						.setThumbnail(user.displayAvatarURL())
						.setTimestamp();
					if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

					return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
				}

				if (!third) {
					if (number === 3) return interaction.editReply({ content: `This user only has 2 warns`, ephemeral: true });
					if (number === 1) {
						const oldreason = first.reason;

						await first.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(user.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
					}
					if (number === 2) {
						const oldreason = second.reason;

						await second.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(user.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
					}
				}
				if (third) {
					if (number === 1) {
						const oldreason = first.reason;

						await first.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(user.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
					}
					if (number === 2) {
						const oldreason = second.reason;

						await second.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(user.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
					}
					if (number === 3) {
						const oldreason = second.reason;

						await third.update({ reason: edit });

						const modlogembed = new Discord.MessageEmbed()
							.setTitle(`:pencil:Warn edited:pencil:`)
							.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n\n**Warn:** ${number}\n**Old reason:** ${oldreason}\n**__New Reason:__** ${edit}\n\n**Edited by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#a260ff')
							.setThumbnail(user.displayAvatarURL())
							.setTimestamp();
						if(modlog) modlog.send({ embeds: [modlogembed] }).catch(O_o => {});

						client.login(server.token);
						return interaction.editReply({ content: `${user}s ${number} warn edited successfully!`, ephemeral: true });
					}
				}

			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
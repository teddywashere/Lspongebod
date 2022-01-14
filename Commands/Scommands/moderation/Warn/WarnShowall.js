/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

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

			const target = interaction.options.getUser('member');
			const id = interaction.options.getString('id');

			if (!target && !id) return interaction.editReply({ content: 'You need to choose either a member or a user id!', ephemeral: true });

			if (target) {
				const userwarns = await Warns.findAll({ where: { user_id: target.id, guild_id: interaction.guild.id } });
				const first = userwarns.find(warn => warn.warn === 1);
				const second = userwarns.find(warn => warn.warn === 2);

				if (!first) return interaction.editReply({ content: 'This member has never been warned.', ephemeral: true });

				if (!second) {
					const mainembed = new Discord.MessageEmbed()
						.setTitle(`:mag_right:Found user:`)
						.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n_ _`)
						.setColor('#b14279')
						.setThumbnail(target.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed = new Discord.MessageEmbed()
						.setTitle(`${target.username}s first warn:`)
						.setDescription(`_ _\n**__Reason:__**\n\n${first.reason}`)
						.setColor('#b14279')
						.setThumbnail(target.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const buttons1 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle('PRIMARY'),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle('PRIMARY')
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);

					await interaction.editReply({ embeds: [mainembed], components: [buttons1], ephemeral: true });

					const filter = i => i.user.id === interaction.user.id;

					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'warn1') {
							await interaction.editReply({ embeds: [warnembed], components: [buttons2], ephemeral: true });
						}
						if (i.customId === 'cancel') {
							return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
						}
					});

					collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
				}

				if (second) {
					const mainembed = new Discord.MessageEmbed()
						.setTitle(`:mag_right:Found user:`)
						.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n_ _`)
						.setColor('#b14279')
						.setThumbnail(target.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed1 = new Discord.MessageEmbed()
						.setTitle(`${target.username}s first warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${first.reason}\n_ _`)
						.setColor('#b14279')
						.setThumbnail(target.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed2 = new Discord.MessageEmbed()
						.setTitle(`${target.username}s second warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${second.reason}\n_ _`)
						.setColor('#b14279')
						.setThumbnail(target.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const buttons1 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons3 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);

					await interaction.editReply({ embeds: [mainembed], components: [buttons1], ephemeral: true });

					const filter = i => i.user.id === interaction.user.id;

					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'warn1') {
							await interaction.editReply({ embeds: [warnembed1], components: [buttons2], ephemeral: true });
						}
						if (i.customId === 'warn2') {
							await interaction.editReply({ embeds: [warnembed2], components: [buttons3], ephemeral: true });
						}
						if (i.customId === 'cancel') {
							return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
						}
					});

					collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
				}
			}

			if (!target) {
				const user = await client.users.fetch(id);
				if (!user) return interaction.editReply({ content: `Couldn't find that user`, ephemeral: true });
				const userwarns = await Warns.findAll({ where: { user_id: id } });
				const first = userwarns.find(warn => warn.warn === 1);
				const second = userwarns.find(warn => warn.warn === 2);
				const third = userwarns.find(warn => warn.warn === 3);

				if (!first) return interaction.editReply({ content: 'This user has never been warned.', ephemeral: true });

				if (!second) {
					const mainembed = new Discord.MessageEmbed()
						.setTitle(`:mag_right:Found user:`)
						.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${id}\`\n_ _`)
						.setColor('#b14279')
						.setThumbnail(user.displayAvatarURL())
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed = new Discord.MessageEmbed()
						.setTitle(`${user.username}s first warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${first.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const buttons1 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle('PRIMARY'),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3)
								.setDisabled(true),


							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle('PRIMARY')
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);

					await interaction.editReply({ embeds: [mainembed], components: [buttons1], ephemeral: true });

					const filter = i => i.user.id === interaction.user.id;

					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'warn1') {
							await interaction.editReply({ embeds: [warnembed], components: [buttons2], ephemeral: true });
						}
						if (i.customId === 'cancel') {
							return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
						}
					});

					collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
				}

				if (second) {
					const mainembed = new Discord.MessageEmbed()
						.setTitle(`:mag_right:Found user:`)
						.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed1 = new Discord.MessageEmbed()
						.setTitle(`${user.username}s first warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${first.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed2 = new Discord.MessageEmbed()
						.setTitle(`${user.username}s second warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${second.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const buttons1 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons3 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);

					await interaction.editReply({ embeds: [mainembed], components: [buttons1], ephemeral: true });

					const filter = i => i.user.id === interaction.user.id;

					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'warn1') {
							await interaction.editReply({ embeds: [warnembed1], components: [buttons2], ephemeral: true });
						}
						if (i.customId === 'warn2') {
							await interaction.editReply({ embeds: [warnembed2], components: [buttons3], ephemeral: true });
						}
						if (i.customId === 'cancel') {
							return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
						}
					});

					collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
				}

				if (third) {
					const mainembed = new Discord.MessageEmbed()
						.setTitle(`:mag_right:Found user:`)
						.setDescription(`_ _\n**Member:** ${user}\n**Tag:** ${user.username}\n**ID:** \`${user.id}\`\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed1 = new Discord.MessageEmbed()
						.setTitle(`${user.username}s first warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${first.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed2 = new Discord.MessageEmbed()
						.setTitle(`${user.username}s second warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${second.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');

					const warnembed3 = new Discord.MessageEmbed()
						.setTitle(`${user.username}s third warn:`)
						.setDescription(`_ _\n**__Reason:__**\n${third.reason}\n_ _`)
						.setColor('#b14279')
						.setFooter('Use the buttons to navigate through the warns');


					const buttons1 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons2 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3),


							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons3 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);
					const buttons4 = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('warn1')
								.setLabel('Warn 1')
								.setStyle(1),

							new MessageButton()
								.setCustomId('warn2')
								.setLabel('Warn 2')
								.setStyle(2),

							new MessageButton()
								.setCustomId('warn3')
								.setLabel('Warn 3')
								.setStyle(3)
								.setDisabled(true),

							new MessageButton()
								.setCustomId('cancel')
								.setLabel('Cancel')
								.setStyle('DANGER'),
						);

					await interaction.editReply({ embeds: [mainembed], components: [buttons1], ephemeral: true });

					const filter = i => i.user.id === interaction.user.id;

					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

					collector.on('collect', async i => {
						if (i.customId === 'warn1') {
							await interaction.editReply({ embeds: [warnembed1], components: [buttons2], ephemeral: true });
						}
						if (i.customId === 'warn2') {
							await interaction.editReply({ embeds: [warnembed2], components: [buttons3], ephemeral: true });
						}
						if (i.customId === 'warn3') {
							await interaction.editReply({ embeds: [warnembed3], components: [buttons4], ephemeral: true });
						}
						if (i.customId === 'cancel') {
							return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
						}
					});

				}

			}
			client.login(server.token);
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
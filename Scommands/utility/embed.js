const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Make and send a new embed')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('basic').setDescription('(STAFF) Only title, text and color')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('footer').setDescription('(STAFF) Title, text, color and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('thumbnail').setDescription('(STAFF) Title, text, color and thumbnail')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('thumbnail').setDescription('A (not too long) image link').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('all').setDescription('(STAFF) Title, text, color, thumbnail and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('thumbnail').setDescription('A (not too long) image link').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('image1').setDescription('(STAFF) Title, text, color and image')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('image').setDescription('The main image link for the embed').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('image2').setDescription('(STAFF) Title, text, color, image and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('image').setDescription('The main image link for the embed').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('colors').setDescription('(STAFF) A list of all possible color names'),
		),

	async execute(interaction) {
		try {
			// const colors = new Map([
			// 	['lightblue', '#64b5f6'], ['brightblue', '#006ee6'], ['darkblue', '#003d80'],
			// 	['lightred', '#e64847'], ['brightred', '#de1e1d'], ['darkred', '#730f0f'],
			// 	['lightyellow', '#ffee78'], ['brightyellow', '#ffe326'], ['darkyellow', '#fdd128'],
			// 	['lightgreen', '#b9dc9a'], ['brightgreen', '#7ebf46'], ['darkgreen', '#527f2b'],
			// 	['lightorange', '#ff9657'], ['brightorange', '#ff6206'], ['darkorange', '#dc5200'],
			// 	['lightpink', '#ff9ad1'], ['brightpink', '#f62681'], ['darkpink', '#9a0048'],
			// 	['lightpurple', '#ca80e9'], ['brightpurple', '#9c27b0'], ['darkpurple', '#3e1046'],
			// ]);

			const colors = require('./colors.json');

			// EMBED BASIC
			if (interaction.options.getSubcommand() === 'basic') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {
					const rbasicembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color);

					if (channel) {
						await channel.send({ embeds: [rbasicembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rbasicembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {
					const sbasicembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color);

					if (channel) {
						await channel.send({ embeds: [sbasicembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [sbasicembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];
					const mbasicembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor);

					if (channel) {
						await channel.send({ embeds: [mbasicembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mbasicembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
			}

			// EMBED FOOTER
			if (interaction.options.getSubcommand() === 'footer') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const footer = await interaction.options.getString('footer');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {
					const rfooterembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setFooter(`${footer}`);
					if (channel) {
						await channel.send({ embeds: [rfooterembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rfooterembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {
					const sfooterembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [sfooterembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [sfooterembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];

					const mfooterembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [mfooterembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mfooterembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}

			}

			// EMBED THUMBNAIL
			if (interaction.options.getSubcommand() === 'thumbnail') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const thumbnail = await interaction.options.getString('thumbnail');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {
					const rthumbnailembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setThumbnail(`${thumbnail}`);

					if (channel) {
						await channel.send({ embeds: [rthumbnailembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rthumbnailembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {
					const sthumbnailembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setThumbnail(`${thumbnail}`);

					if (channel) {
						await channel.send({ embeds: [sthumbnailembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [sthumbnailembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];

					const mthumbnailembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor)
						.setThumbnail(`${thumbnail}`);

					if (channel) {
						await channel.send({ embeds: [mthumbnailembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mthumbnailembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}

			}
			// EMBED ALL
			if (interaction.options.getSubcommand() === 'all') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const thumbnail = await interaction.options.getString('thumbnail');
				const footer = await interaction.options.getString('footer');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {
					const rallembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setThumbnail(`${thumbnail}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [rallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rallembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {
					const sallembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setThumbnail(`${thumbnail}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [sallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [sallembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];

					const mallembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor)
						.setThumbnail(`${thumbnail}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [mallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mallembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}

			}

			// EMBED IMAGE1
			if (interaction.options.getSubcommand() === 'image1') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const image = await interaction.options.getString('image');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {

					const rimageonembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setImage(`${image}`);

					if (channel) {
						await channel.send({ embeds: [rimageonembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rimageonembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {

					const simageonembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setImage(`${image}`);

					if (channel) {
						await channel.send({ embeds: [simageonembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [simageonembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];


					const mimageonembed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor)
						.setImage(`${image}`);

					if (channel) {
						await channel.send({ embeds: [mimageonembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mimageonembed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
			}

			// EMBED IMAGE2
			if (interaction.options.getSubcommand() === 'image2') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const title = await interaction.options.getString('title');
				const description = await interaction.options.getString('description');
				const color = await interaction.options.getString('color');
				const image = await interaction.options.getString('image');
				const footer = await interaction.options.getString('footer');
				const channel = await interaction.options.getChannel('channel');

				// COLOR RANDOM
				if (color === 'RANDOM') {
					const rimagetwombed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(color)
						.setImage(`${image}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [rimagetwombed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [rimagetwombed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR HEX CODE
				if (color.includes('#')) {
					const simagetwombed = new Discord.MessageEmbed()
						.setTitle(title)
						.setDescription(`${description}`)
						.setColor(color)
						.setImage(`${image}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [simagetwombed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [simagetwombed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
				// COLOR FROM MAP
				if (color != 'RANDOM' || color.startsWith() != '#') {
					const mapcolor = colors[`${color.toLowerCase()}`];

					const mimagetwombed = new Discord.MessageEmbed()
						.setTitle(`${title}`)
						.setDescription(`${description}`)
						.setColor(mapcolor)
						.setImage(`${image}`)
						.setFooter(`${footer}`);

					if (channel) {
						await channel.send({ embeds: [mimagetwombed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!channel) {
						await interaction.channel.send({ embeds: [mimagetwombed] });
						return interaction.editReply({ content: 'Embed send.', ephemeral: true });
					}
				}
			}

			// EMBED COLORS
			if (interaction.options.getSubcommand() === 'colors') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const colorsembed = new Discord.MessageEmbed()
					.setTitle(`**All precoded colors**`)
					.setDescription(`_ _\nReact with the colored emojis, to see you options of that color\n\nWhen using the other embed commands, you can set these color names as the color option.\n_ _`)
					.setImage('https://cdn.discordapp.com/attachments/772471934231117834/914888708287787088/Screenshot_20211129-154047_1.png');

				const blueembed = new Discord.MessageEmbed()
					.setTitle(`**All available blues**`)
					.setDescription(`> lightblue\n> brightblue\n> darkblue`)
					.setColor('#2a9df4');

				const redembed = new Discord.MessageEmbed()
					.setTitle(`**All available reds**`)
					.setDescription(`> lightred\n> brightred\n> darkred`)
					.setColor('#ff0000');

				const yellowembed = new Discord.MessageEmbed()
					.setTitle(`**All available yellows**`)
					.setDescription(`> lightyellow\n> brightyellow\n> darkyellow`)
					.setColor('#ffff00');

				const greenembed = new Discord.MessageEmbed()
					.setTitle(`**All available greens**`)
					.setDescription(`> lightgreen\n> brightgreen\n> darkgreen`)
					.setColor('#00ff00');

				const orangeembed = new Discord.MessageEmbed()
					.setTitle(`**All available oragnes**`)
					.setDescription(`> lightorange\n> brightorange\n> darkorange`)
					.setColor('#ff6600');

				const pinkembed = new Discord.MessageEmbed()
					.setTitle(`**All available pinks**`)
					.setDescription(`> lightpink\n> brightpink\n> darkpink`)
					.setColor('#f61e61');

				const purpleembed = new Discord.MessageEmbed()
					.setTitle(`**All available purples**`)
					.setDescription(`> lightpurple\n> brightpurple\n> darkpurple`)
					.setColor('#800080');

				const embed = await interaction.channel.send({ embeds: [colorsembed] });
				Promise.all([
					await embed.react('💙'),
					await embed.react('❤️'),
					await embed.react('💛'),
					await embed.react('💚'),
					await embed.react('🧡'),
					await embed.react('🩰'),
					await embed.react('💜'),
				])
					.catch(error => console.error('One of the emojis failed to react:', error));

				const filter = (reaction, user) => {
					return ['💙', '❤️', '💛', '💚', '🧡', '🩰', '💜'].includes(reaction.emoji.name) && user.id === interaction.user.id;
				};

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
					.then(collected => {
						if (collected.has('💙')) {
							embed.edit({ embeds: [blueembed] });
						}
						if (collected.has('❤️')) {
							embed.edit({ embeds: [redembed] });
						}
						if (collected.has('💛')) {
							embed.edit({ embeds: [yellowembed] });
						}
						if (collected.has('💚')) {
							embed.edit({ embeds: [greenembed] });
						}
						if (collected.has('🧡')) {
							embed.edit({ embeds: [orangeembed] });
						}
						if (collected.has('🩰')) {
							embed.edit({ embeds: [pinkembed] });
						}
						if (collected.has('💜')) {
							embed.edit({ embeds: [purpleembed] });
						}
					})
					.catch(collected => {
						console.log(collected);
					});

				await embed.reactions.removeAll().catch(O_o => console.log(O_o));
				return interaction.editReply({ content:`Hope you found something.\nIf not feel free to use this command again or make a suggestion for a new color to add.`, ephemeral: true });
			}
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
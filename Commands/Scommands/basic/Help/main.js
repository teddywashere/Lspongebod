/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { staffr, adminr } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const author = interaction.guild.members.cache.get(interaction.user.id);
			const main = new Discord.MessageEmbed()
				.setTitle(`:balloon: Main Help Menu`)
				.setDescription(`_ _\n**__Basic Commands:__**\n> ping _ _  _ _ *\`gives the approximate ping\`*\n> say _ _   _ _  *\`repeats your message\`*\n> whois _ _ *\`gives info on a member or user\`*\n_ _`)
				.setColor('#e62d2d')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917774638447198218/Screenshot_20211207-144830_1.png')
				.setFooter('say [lsb slash] for help on how to use slash commands');

			const staff = new Discord.MessageEmbed()
				.setTitle(`:flags: Staff Help Menu`)
				.setDescription(`_ _\n**__Moderation Commands:__**\n> arrest _ _ *\`throw em in jail\`*\n> ban _ _   _ _ *\`ban a member or id\`*\n> kick _ _   _ _ *\`kick a member\`*\n> mute _ _ _ _ *\`mute a member\`*\n> un _ _   _ _  _ _ *\`undo a mute or ban\`*\n> warn _ _ _ _ *\`add, edit, remove or show warn(s)\`*\n\n**__Utility__**\n> prune _ _  *\`delete messages\`*\n> role _ _   _ _  *\`add or remove a role\`*\n> ticket _ _ _ _ *\`rename/close ticket, add/remove member\`*\n> qotd _ _   _ _ *\`make a new qotd\`*\n> embed _ _ *\`make various different embeds\`*\n_ _`)
				.setColor('#2c9ee2')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917774551616720936/Screenshot_20211207-144755_1.png');

			const admin = new Discord.MessageEmbed()
				.setTitle(`:wind_chime: Admin Help Menu`)
				.setDescription(`_ _\n**__Main:__**\n> backup   _ _  *\`update the server template\`*\n> delticket _ _ *\`delete a ticket\`*\n> dm _ _  _ _  _ _  _ _ _ _ *\`dm a member (send only)\`*`)
				.setColor('#2da263')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917774551910346772/SpongeBob_BfBB_00.jpg');

			const fbuttons = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY')
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);
			const sbuttons1 = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY')
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);
			const sbuttons2 = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY'),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);
			const abuttons1 = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY')
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);
			const abuttons2 = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY'),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);
			const abuttons3 = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setLabel('Main')
						.setCustomId('main')
						.setStyle('PRIMARY'),

					new Discord.MessageButton()
						.setLabel('Staff')
						.setCustomId('staff')
						.setStyle(2),

					new Discord.MessageButton()
						.setLabel('Admin')
						.setCustomId('admin')
						.setStyle(3)
						.setDisabled(true),

					new Discord.MessageButton()
						.setLabel('Cancel')
						.setCustomId('cancel')
						.setStyle('DANGER'),
				);

			if (!author.roles.cache.has(adminr) && !author.roles.cache.has(staffr)) {
				await interaction.editReply({ embeds: [main], components: [fbuttons], ephemeral: true });

				const filter = i => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

				collector.on('collect', async i => {
					if (i.customId === 'cancel') {
						return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
					}
				});

				collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
			}

			if (author.roles.cache.has(staffr) && !author.roles.cache.has(adminr)) {
				await interaction.editReply({ embeds: [main], components: [sbuttons1], ephemeral: true });

				const filter = i => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async i => {
					if (i.customId === 'main') {
						return interaction.editReply({ embeds: [main], components: [sbuttons1], ephemeral: true });
					}
					if (i.customId === 'staff') {
						return interaction.editReply({ embeds: [staff], components: [sbuttons2], ephemeral: true });
					}
					if (i.customId === 'cancel') {
						return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
					}
				});

				collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
			}

			if (author.roles.cache.has(adminr)) {
				await interaction.editReply({ embeds: [main], components: [abuttons1], ephemeral: true });

				const filter = i => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async i => {
					if (i.customId === 'main') {
						return interaction.editReply({ embeds: [main], components: [abuttons1], ephemeral: true });
					}
					if (i.customId === 'staff') {
						return interaction.editReply({ embeds: [staff], components: [abuttons2], ephemeral: true });
					}

					if (i.customId === 'admin') {
						return interaction.editReply({ embeds: [admin], components: [abuttons3], ephemeral: true });
					}
					if (i.customId === 'cancel') {
						return interaction.editReply({ content: `Cancelled`, embeds: [], components: [], ephemeral: true });
					}
				});

				collector.on('end', collected => interaction.editReply({ components: [], ephemeral: true }));
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
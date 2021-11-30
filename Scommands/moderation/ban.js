const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

const { modlogc, criminalsc, owner, clientId, token } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('(STAFF) Ban a member either by tagging them (target) or giving me their id.')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('target')
				.setDescription('(STAFF) The server member to ban')
				.addStringOption(option => option.setName('reason').setDescription('The reason for being banned').setRequired(true))
				.addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('id')
				.setDescription('(STAFF) The user id to ban')
				.addStringOption(option => option.setName('reason').setDescription('The reason for being banned').setRequired(true))
				.addStringOption(option => option.setName('id').setDescription('The id of the user to ban').setRequired(true)),
		),

	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);
			// get bans
			const banmap = await interaction.guild.bans.fetch();

			// error checks
			const me = await interaction.guild.members.cache.get(owner);
			if (!modlog || !criminals) await me.send(`${interaction.user} tried to use ban command in ${interaction.guild}\n**ERROR:**\n Either modlog or criminals not found.`).catch(O_o => console.log(O_o));

			// TARGET
			if (interaction.options.getSubcommand() === 'target') {
				await interaction.reply({ content: `Banning...`, ephemeral: true });
				const target = await interaction.options.getUser('target');
				const reason = await interaction.options.getString('reason');
				const member = await interaction.guild.members.cache.get(target.id);

				if (interaction.user.id === target.id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
				if (target.id === clientId) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
				if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });

				// ban target
				const dmembed = new Discord.MessageEmbed()
					.setTitle(`You were banned from ${interaction.guild}`)
					.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
					.setColor('#ff0052')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {console.error(O_o); });
				const rip = target.id;
				await member.ban({ days: 7, reason: reason });

				// modlog
				const targetembed = new Discord.MessageEmbed()
					.setTitle(`:name_badge:**Member Banned**:name_badge:`)
					.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${rip}\`\n\n**Banned by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
					.setColor('#ff0052')
					.setThumbnail(target.displayAvatarURL())
					.setTimestamp();

				await modlog.send({ embeds: [targetembed] }).catch(O_o => me.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				// criminals
				const ripcrime = new Discord.MessageEmbed()
					.setTitle(`**\`${rip}\` has been banned** `)
					.setDescription(`**Reason:** ${reason}\n_ _`)
					.setColor('#ff0052')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
					.setTimestamp();

				await criminals.send({ embeds: [ripcrime] }).catch(O_o => me.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				// reply
				return interaction.editReply({ content: `\`${rip}\` has been banned`, ephemeral: true });
			}


			if (interaction.options.getSubcommand() === 'id') {
				await interaction.reply({ content: `Banning...`, ephemeral: true });
				const reason = await interaction.options.getString('reason');
				const id = await interaction.options.getString('id');

				if (interaction.user.id === id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
				if (id === clientId) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
				if (!client.users.fetch(id)) await interaction.editReply({ content: `${id} is not a userId.`, ephemeral: true });
				if (banmap.get(id)) return interaction.editReply({ content:`This user is already banned.`, ephemeral: true });

				// ban
				await interaction.guild.members.ban(id);

				// modlog
				const idembed = new Discord.MessageEmbed()
					.setTitle(`:name_badge:**User Banned**:name_badge:`)
					.setDescription(`_ _\n**User:** \`${id}\`\n\n**Banned by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
					.setColor('#ff0052')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
					.setTimestamp();

				await modlog.send({ embeds: [idembed] }).catch(O_o => me.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				// criminals
				const idcrime = new Discord.MessageEmbed()
					.setTitle(`**\`${id}\` has been banned** `)
					.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
					.setColor('#ff0052')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
					.setTimestamp();

				await criminals.send({ embeds: [idcrime] }).catch(O_o => me.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				return interaction.editReply({ content: `\`${id}\` has been banned`, ephemeral: true });
			}
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
client.login(token);
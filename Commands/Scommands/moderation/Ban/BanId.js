const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

const { modlogc, criminalsc, errorc, clientId, token } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);
			// get bans
			const banmap = await interaction.guild.bans.fetch();

			// error checks
			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first');
			if (!modlog || !criminals) await error.send(`${interaction.user} tried to use ban command in ${interaction.guild}\n**ERROR:**\n Either modlog or criminals not found.`);

			const reason = await interaction.options.getString('reason');
			const id = await interaction.options.getString('id');

			if (interaction.user.id === id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
			if (id === clientId) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
			const user = await client.users.fetch(id).catch ((O_o) => {
				console.error(O_o);
				return interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
			});
			if (!user) return;
			if (banmap.get(id)) return interaction.editReply({ content:`This user is already banned.`, ephemeral: true });

			// ban
			await interaction.guild.members.ban(id, { reason: reason });

			// modlog
			const idembed = new Discord.MessageEmbed()
				.setTitle(`:name_badge:**User Banned**:name_badge:`)
				.setDescription(`_ _\n**User:** \`${id}\`\n\n**Banned by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
				.setTimestamp();

			await modlog.send({ embeds: [idembed] }).catch(O_o => error.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			// criminals
			const idcrime = new Discord.MessageEmbed()
				.setTitle(`**\`${id}\` has been banned** `)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
				.setTimestamp();

			await criminals.send({ embeds: [idcrime] }).catch(O_o => error.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `\`${id}\` has been banned`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
client.login(token);
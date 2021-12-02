const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

const { modlogc, owner, token } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('(STAFF) Unbans a user')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('id').setDescription('UserID of the user to unban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for unban').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Unbanning...`, ephemeral: true });

			const id = await interaction.options.getString('id');
			const reason = await interaction.options.getString('reason');
			const modlog = await interaction.guild.channels.cache.get(modlogc);
			// get bans
			const banmap = await interaction.guild.bans.fetch();

			const me = await interaction.guild.members.cache.get(owner);
			if (!modlog) await me.send(`${interaction.user} tried to use unban command in ${interaction.guild}\n**ERROR:**\nModlog not found`);
			const user = await client.users.fetch(id).catch ((error) => {
				console.error(error);
				return interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
			});
			if (!user) return;
			if (!banmap.get(id)) return interaction.editReply({ content:`This user is not banned.`, ephemeral: true });

			// unban
			await interaction.guild.members.unban(id);

			// modlog and reply
			const unbanembed = new Discord.MessageEmbed()
				.setTitle(`:flag_white:**User Unbanned**:flag_white:`)
				.setDescription(`_ _\n**User:** \`${id}\`\n\n**Unbanned by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ffd000')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911568145754497064/unban.jpg')
				.setTimestamp();

			await modlog.send({ embeds: [unbanembed] }).catch(O_o => me.send(`${interaction.user} tried to use unban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `${id} has been unbanned.`, ephemeral: true });

		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
client.login(token);
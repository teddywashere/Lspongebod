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

const Setup = require('../../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('BAN_MEMBERS')) return interaction.editReply({ content: `You don't have the ban members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const id = await interaction.options.getString('id');
			const reason = await interaction.options.getString('reason');
			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);

			const banmap = await interaction.guild.bans.fetch();

			if (!banmap.get(id)) return interaction.editReply({ content:`This user is not banned.`, ephemeral: true });

			await interaction.guild.members.unban(id).catch(O_o => {});

			const unbanembed = new Discord.MessageEmbed()
				.setTitle(`:flag_white:**User Unbanned**:flag_white:`)
				.setDescription(`_ _\n**User:** \`${id}\`\n**Unbanned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ffd000')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911568145754497064/unban.jpg')
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [unbanembed] }).catch(O_o => {});

			return interaction.editReply({ content: `${id} has been unbanned.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
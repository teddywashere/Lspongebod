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
			const member = await interaction.guild.members.cache.get(interaction.user.id);
			if (!member.permissions.has('BAN_MEMBERS')) return interaction.editReply({ content: `You don't have the ban members permission.`, ephemeral: true });
			
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);

			const banmap = await interaction.guild.bans.fetch();

			const reason = await interaction.options.getString('reason');
			const id = await interaction.options.getString('id');

			if (interaction.user.id === id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
			if (id === server.client_id) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
			// const user = await client.users.fetch(id).catch ((O_o) => {});
			// if (!user) return interaction.followUp({ content: `**Couldnt find this user anywhere on discord...**`, ephemeral: true });;
			if (banmap.get(id)) return interaction.editReply({ content:`This user is already banned.`, ephemeral: true });

			await interaction.guild.members.ban(id, { reason: reason }).catch(O_o => {return interaction.followUp({ content: `I don't think that ban went through. Please double check you've gotten the id right`, ephemeral: true }); });

			const target = await client.users.fetch(id).catch(error => { 
				if (error.name === 'DiscordAPIError') { return interaction.followUp({ content: 'Can confirm, you got the id wrong.', ephemeral: true });}
			})
			if (!target) return;
			const idembed = new Discord.MessageEmbed()
				.setTitle(`:name_badge:**User Banned**:name_badge:`)
				.setDescription(`_ _\n\n**Tag:** ${target.tag}\n\n**ID:** \`${id}\`\n\n**Banned by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			const idcrime = new Discord.MessageEmbed()
				.setTitle(`**\`${id}\` has been banned** `)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [idembed] }).catch(O_o => {});
			if(criminals) criminals.send({ embeds: [idcrime] }).catch(O_o => {});

			client.login(server.token);
			return interaction.editReply({ content: `\`${id}\` has been banned`, ephemeral: true });
		}
		catch (O_o) {
			if (O_o === 'DiscordAPIError') {
				return interaction.followUp({ content: `That was not a user id.`, ephemeral: true });
			}
			console.error(O_o);
		}
	},
};
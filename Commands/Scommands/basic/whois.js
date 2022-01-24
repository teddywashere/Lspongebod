/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
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

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);
const Warns = require('../../../DatabaseModels/Warns')(sequelize, Sequelize);
const { token } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Gives all the info on an account')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('member').setDescription('Gives info on a server member')
				.addUserOption(option => option.setName('member').setDescription('The member you want info on').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('id').setDescription('Gives info on any discord user')
				.addStringOption(option => option.setName('id').setDescription('The id of the user you want info on').setRequired(true)),
		),
	async execute(interaction) {
		try {
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.reply({ content: `Please do /setup error first` });
			client.login(server.token);

			// MEMBER
			if (interaction.options.getSubcommand() === 'member') {
				await interaction.reply({ content: `Searching...`, ephemeral: true });

				const member = await interaction.options.getUser('member');
				const mem = await client.users.fetch(member.id);
				const guildmem = await interaction.guild.members.cache.get(member.id);

				const warns = await Warns.findAll({ where: { user_id: member.id, guild_id: interaction.guild.id } });
				const warnmap = await warns.map(w => w.user_id);

				const memberembed = new Discord.MessageEmbed()
					.setTitle(`Member info:`)
					.setThumbnail(member.displayAvatarURL())
					.setDescription(`_ _\n**Member:** ${member}\n\n**Tag:** ${member.tag}\n\n**ID:** \`${member.id}\`\n\n**Account created:** ${mem.createdAt}\n${mem.createdTimestamp} \n\n**Joined server:** ${guildmem.joinedAt}\n${guildmem.joinedTimestamp}\n\n**Warns:** \`${warnmap.lenght}\`_ _`)
					.setColor('#00ffb6')
					.setTimestamp();

				return interaction.editReply({ content:`Found member:`, embeds: [memberembed] });
			}

			// ID
			if (interaction.options.getSubcommand() === 'id') {
				await interaction.reply({ content: `Searching...`, ephemeral: true });

				const id = await interaction.options.getString('id');
				const user = await client.users.fetch(id).catch(error => { 
					if (error.name === 'DiscordAPIError') { return interaction.followUp({ content: 'Can confirm, you got the id wrong.', ephemeral: true });}
				})
				if (!user) return;
				const banmap = await interaction.guild.bans.fetch();
				const warns = await Warns.findAll({ where: { user_id: id, guild_id: interaction.guild.id } });
				const warnmap = await warns.map(w => w.user_id);

				const idembed = new Discord.MessageEmbed()
					.setTitle(`User info:`)
					.setThumbnail(user.displayAvatarURL())
					.setDescription(`_ _\n**User:** ${user}\n\n**Tag:** ${user.tag}\n\n**ID:** \`${user.id}\`\n\n**Account created:** ${user.createdAt}\n ${user.createdTimestamp}\n\n**Warns:** \`${warnmap.lenght}\`_ _`)
					.setColor('#00ffb6')
					.setTimestamp();

				await interaction.editReply({ content: `Found member:`, embeds: [idembed] });

				if (banmap.get(id)) {
					const banned = await banmap.get(id);
					const bannedembed = new Discord.MessageEmbed()
						.setTitle(`User info:`)
						.setThumbnail(user.displayAvatarURL())
						.setDescription(`_ _\n**User:** ${user}\n\n**Tag:** ${user.tag}\n\n**ID:** \`${user.id}\`\n\n**Account created:** ${user.createdAt}\n ${user.createdTimestamp}\n\n**Warns:** \`${warnmap.lenght}\`\n\n**This user is banned from this guild. Reason:**\n\`${banned.reason}\`\n_ _`)
						.setColor('#00ffb6')
						.setTimestamp();

					await interaction.editReply({ embeds: [bannedembed] });
				}
			}
			
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}
	},
};
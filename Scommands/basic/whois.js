const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const { token } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Gives all the info on an account')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('member').setDescription('Gives info on a server member')
				.addUserOption(option => option.setName('target').setDescription('The member you want info on').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('id').setDescription('Gives info on any discord user')
				.addStringOption(option => option.setName('id').setDescription('The id of the user you want info on').setRequired(true)),
		),
	async execute(interaction) {
		try {
			// MEMBER
			if (interaction.options.getSubcommand() === 'member') {
				await interaction.reply({ content: `Searching...`, ephemeral: true});

				const member = await interaction.options.getUser('target');
				const mem = await client.users.fetch(member.id);
				const guildmem = await interaction.guild.members.cache.get(member.id);

				const memberembed = new Discord.MessageEmbed()
					.setTitle(`Member info:`)
					.setThumbnail(member.displayAvatarURL())
					.setDescription(`_ _\n**Member:** ${member}\n\n**Tag:** ${member.tag}\n\n**ID:** \`${member.id}\`\n\n**Account created:** ${mem.createdAt}\n${mem.createdTimestamp} \n\n**Joined server:** ${guildmem.joinedAt}\n${guildmem.joinedTimestamp}\n_ _`)
					.setColor('#00ffb6')
					.setTimestamp();

				return interaction.editReply({ content:`Found member:`, embeds: [memberembed] });
			}

			// ID
			if (interaction.options.getSubcommand() === 'id') {
				await interaction.reply({ content: `Searching...`, ephemeral: true});

				const id = await interaction.options.getString('id');
				const user = await client.users.fetch(id).catch ((error) => {
					console.error(error);
					return interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
				});
				const banmap = await interaction.guild.bans.fetch();

				const idembed = new Discord.MessageEmbed()
					.setTitle(`User info:`)
					.setThumbnail(user.displayAvatarURL())
					.setDescription(`_ _\n**User:** ${user}\n\n**Tag:** ${user.tag}\n\n**ID:** \`${user.id}\`\n\n**Account created:** ${user.createdAt}\n ${user.createdTimestamp}\n_ _`)
					.setColor('#00ffb6')
					.setTimestamp();

				await interaction.editReply({ content: `Found member:`, embeds: [idembed] });

				if (banmap.get(id)) {
					const banned = await banmap.get(id);
					const bannedembed = new Discord.MessageEmbed()
						.setTitle(`User info:`)
						.setThumbnail(user.displayAvatarURL())
						.setDescription(`_ _\n**User:** ${user}\n\n**Tag:** ${user.tag}\n\n**ID:** \`${user.id}\`\n\n**Account created:** ${user.createdAt}\n ${user.createdTimestamp}\n\n**This user is banned from this guild. Reason:**\n\`${banned.reason}\`\n_ _`)
						.setColor('#00ffb6')
						.setTimestamp();

					await interaction.editReply({ embeds: [bannedembed] });
				}
			}
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}
	},
};
client.login(token);
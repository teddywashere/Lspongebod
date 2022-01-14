const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);
const randomquestion = require('./questions.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qotd')
		.setDescription('(STAFF) New question of the day, will automatically be send to general if set, else this channel')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('question').setDescription('The question to ask, if none it will choose a random one')),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Sending...`, ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const question = await interaction.options.getString('question');
			const general = await interaction.guild.channels.cache.get(server.general_chat);
			const chatrev = await interaction.guild.roles.cache.get(server.chatreviver_role);

			if (question) {
				const qotdembed = new Discord.MessageEmbed()
					.setTitle(`┍—————————— /ᐠ｡ꞈ｡ᐟ\\ —————————┑`)
					.setDescription(`${question}`)
					.setFooter(`┕————————————(..)(..)————————————┙`)
					.setColor('RANDOM');

				if (!general) {
					if (chatrev) {
						await interaction.channel.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
					if (!chatrev) {
						await interaction.channel.send({ content: `**__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
				}
				if (general) {
					if (chatrev) {
						await general.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
					if (!chatrev) {
						await general.send({ content: `**__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
				}
			}

			if (!question) {
				const number = [Math.floor(Math.random() * 201 + 1)];
				const rquestion = randomquestion[`${number}`];
				// make qotd embed
				const qotdembed = new Discord.MessageEmbed()
					.setTitle(`┍—————————— /ᐠ｡ꞈ｡ᐟ\\ —————————┑`)
					.setDescription(`${rquestion}`)
					.setFooter(`┕————————————(..)(..)————————————┙`)
					.setColor('RANDOM');

				if (!general) {
					if (chatrev) {
						await interaction.channel.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
					if (!chatrev) {
						await interaction.channel.send({ content: `**__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
				}
				if (general) {
					if (chatrev) {
						await general.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
					if (!chatrev) {
						await general.send({ content: `**__☆Question of the Day☆__**`, embeds: [qotdembed] });
						return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
					}
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
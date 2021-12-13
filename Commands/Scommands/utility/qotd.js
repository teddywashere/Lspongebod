const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { chatrevr, generalc } = require('../../../config.json');
const randomquestion = require('./questions.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qotd')
		.setDescription('(STAFF) New question of the day, will automatically be send to general')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('question').setDescription('The question to ask, if none it will choose a random one')),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Sending...`, ephemeral: true });

			const question = await interaction.options.getString('question');
			const general = await interaction.guild.channels.cache.get(generalc);
			const chatrev = await interaction.guild.roles.cache.get(chatrevr);

			if (!chatrev) return interaction.editReply({ content: `Chat reviver role not found`, ephemeral: true });
			if (!general) return interaction.editReply({ content: `General channel not found`, ephemeral: true });

			if (question) {
				// make qotd embed
				const qotdembed = new Discord.MessageEmbed()
					.setTitle(`┍—————————— /ᐠ｡ꞈ｡ᐟ\\ —————————┑`)
					.setDescription(`${question}`)
					.setFooter(`┕————————————(..)(..)————————————┙`)
					.setColor('RANDOM');

				await general.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
				return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
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

				await general.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });
				return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
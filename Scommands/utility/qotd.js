const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { chatrevr, generalc } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qotd')
		.setDescription('(STAFF) Make new question of the day, will automatically be send to general')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('question').setDescription('The question to ask').setRequired(true)),
	async execute(interaction) {
		try {
			interaction.reply({ content: `Sending...`, ephemeral: true });

			const question = await interaction.options.getString('question');
			const general = await interaction.guild.channels.cache.get(generalc);
			const chatrev = await interaction.guild.roles.cache.get(chatrevr);

			if (!chatrev) return interaction.editReply({ content: `Chat reviver role not found`, ephemeral: true });
			if (!general) return interaction.editReply({ content: `General channel not found`, ephemeral: true });

			// make qotd embed
			const qotdembed = new Discord.MessageEmbed()
				.setTitle(`┍—————————— /ᐠ｡ꞈ｡ᐟ\\ —————————┑`)
				.setDescription(`${question}`)
				.setFooter(`┕————————————(..)(..)————————————┙`)
				.setColor('RANDOM');

			await general.send({ content: `${chatrev} **__☆Question of the Day☆__**`, embeds: [qotdembed] });

			return interaction.editReply({ content: `Qotd send!`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
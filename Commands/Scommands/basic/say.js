/* eslint-disable no-unused-vars */
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Sends the message you want')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('message').setDescription('The message you want me to send').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Typing...`, ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const message = await interaction.options.getString('message');
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);

			await interaction.channel.send(`${message}`);

			const logembed = new Discord.MessageEmbed()
				.setTitle(`**Say Used**`)
				.setDescription(`Used by ${interaction.user}\n${interaction.user.tag}\n\`${interaction.user.id}\`\n\n Message: \`${message}\``)
				.setTimestamp();

			if (logs) logs.send({ embeds: [logembed] }).catch(O_o => {});
			return interaction.editReply({ content: `Done.`, ephemeral: true });
		}
		catch (O_o) {
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
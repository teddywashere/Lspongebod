/* eslint-disable no-empty-function */
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
const Tickets = require('../../../DatabaseModels/Tickets')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delticket')
		.setDescription('(ADMIN) Delete a ticket')
		.setDefaultPermission(false)
		.addChannelOption(option => option.setName('ticket').setDescription('The ticket channel to delete').setRequired(true)),
	async execute(interaction) {
		try {
			const member = await interaction.guild.members.cache.get(interaction.user.id);
			if (!member.permissions.has('ADMINISTRATOR')) return;
			await interaction.reply({ content: `Deleting...`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first`, ephemeral: true });

			const channel = await interaction.options.getChannel('ticket');
			const ticket = await Tickets.findOne({ where: { channel_id: channel.id, guild_id: interaction.guild.id } });
			if (!ticket) return interaction.editReply({ content: `Are you sure the channel you want to delete is a ticket?` });

			const logs = await interaction.guild.channels.cache.get(server.logs_channel);

			const delembed = new Discord.MessageEmbed()
				.setTitle(`:no_entry_sign:**Ticket deleted**:no_entry_sign:`)
				.setDescription(`_ _\n**Ticket:** ${channel.name}\n\n**Deleted by:** ${member}\n${member.tag}\n_ _`)
				.setColor('#3297ff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725752640856104/Screenshot_20211123-162553_1.png')
				.setTimestamp();

			if (logs) logs.send({ embeds: [delembed] }).catch(O_o => {});

			return channel.delete();
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
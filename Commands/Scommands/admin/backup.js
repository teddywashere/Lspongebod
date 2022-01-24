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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('(ADMIN) Syncs the server template')
		.setDefaultPermission(false),

	async execute(interaction) {
		try {
			const member = await interaction.guild.members.cache.get(interaction.user.id);
			if (!member.permissions.has('ADMINISTRATOR')) return;
			await interaction.reply({ content: 'Backing up...', ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);

			const templates = await interaction.guild.fetchTemplates();
			const backup = await templates.get(server.server_template);
			if (!backup) return interaction.editReply({ content: `You need to run /setup other and set up a server template first` });

			if (backup) {
				await backup.sync();
				await backup.edit({ name: 'coding hell', description: `backup ${Date.now()}` });

				const logsembed = new Discord.MessageEmbed()
					.setTitle(`:dvd:**Server Backup**:dvd:`)
					.setDescription(`_ _\n${member} backed up the server\n\nBackup template: "https://discord.new/${server.server_template}"\n_ _`)
					.setColor('#b68f00')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912633025928515644/Screenshot_20211123-101728_1.png')
					.setTimestamp();


				if (logs) logs.send({ embeds: [logsembed] }).catch(O_o => {});
				return interaction.editReply({ content: 'Template successfully backed up', ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
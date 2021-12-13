/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, template, errorc } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('backup')
		.setDescription('(ADMIN) Syncs the server template')
		.setDefaultPermission(false),

	async execute(interaction) {
		try {
			await interaction.reply({ content: 'Backing up...', ephemeral: true });
			const logs = await interaction.guild.channels.cache.get(logsc);
			const member = await interaction.guild.members.cache.get(interaction.user.id);

			const templates = await interaction.guild.fetchTemplates();
			const backup = await templates.get(template);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do setup first!');
			if (!logs || !member) await error.send(`Couldn't find eihter the log channel or "member"`);

			if (backup) {
				await backup.sync();
				await backup.edit({ name: 'coding hell', description: `backup ${Date.now()}` });

				const logsembed = new Discord.MessageEmbed()
					.setTitle(`:dvd:**Server Backup**:dvd:`)
					.setDescription(`_ _\n${member} backed up the server\n\nBackup template: "https://discord.new/${template}"\n_ _`)
					.setColor('#b68f00')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912633025928515644/Screenshot_20211123-101728_1.png')
					.setTimestamp();


				await logs.send({ embeds: [logsembed] }).catch(O_o => error.send(`Please setup the server properly (logs channel not found)`));
				return interaction.editReply({ content: 'Template successfully backed up', ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
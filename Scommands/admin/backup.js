const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, template, owner } = require('./../../config.json');

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

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs || !member) await me.send(`${member} used the backup command in ${interaction.guild}\n**ERROR:**\nCouldn't find eihter the log channel or "member"`).catch(O_o => console.log(O_o));

			if (backup) {
				await backup.sync();
				await backup.edit({ name: 'coding hell', description: `backup ${Date.now()}` });

				const logsembed = new Discord.MessageEmbed()
					.setTitle(`:dvd:**Server Backup**:dvd:`)
					.setDescription(`_ _\n${member} backed up the server\n\nBackup template: "https://discord.new/${template}"\n_ _`)
					.setColor('#b68f00')
					.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912633025928515644/Screenshot_20211123-101728_1.png')
					.setTimestamp();


				await logs.send({ embeds: [logsembed] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
				return interaction.editReply({ content: 'Template successfully backed up', ephemeral: true });
			}
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
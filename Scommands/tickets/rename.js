const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { opentickets, closedtickets, logsc, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('(STAFF) Rename a ticket')
		.setDefaultPermission(false)
		.addChannelOption(option => option.setName('ticket').setDescription('The ticket to rename').setRequired(true))
		.addStringOption(option => option.setName('name').setDescription('The new name for the ticket. No #, etc.').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: 'Renaming...', ephemeral: true });

			const ticket = await interaction.options.getChannel('ticket');
			const oldname = await ticket.name;
			const newname = await interaction.options.getString('name');
			const logs = await interaction.guild.channels.cache.get(logsc);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send({ content: `${interaction.user} wanted to rename a ticket in ${interaction.guild}\n**ERROR:**\nLogs not found` }).catch(O_o => console.log(O_o));
			if (ticket.parentId != opentickets && ticket.parentId != closedtickets) return interaction.editReply({ content: 'Please make sure the channel you want to rename is a ticket.', ephemeral: true });

			await ticket.setName(newname);

			const renamembed = new Discord.MessageEmbed()
				.setTitle(`:pencil:**Ticket Renamed** :pencil:`)
				.setDescription(`_ _\n**Ticket:** ${ticket}\n\n**Old** **Name:** ${oldname}\n\n**New** **Name:** ${newname}\n\n**Renamed** **by:** ${interaction.user}\n_ _`)
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/915190372152528936/DoodleBob.Pencil.jpg')
				.setColor('#64b4ff')
				.setTimestamp();

			await logs.send({ embeds: [renamembed] }).catch(O_o => me.send(`${interaction.user} tried to rename a ticket in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `${ticket} renamed.`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
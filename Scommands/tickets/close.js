const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { closedtickets, logsc, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('(STAFF) Close a ticket')
		.setDefaultPermission(false)
		.addChannelOption(option => option.setName('ticket').setDescription('The ticket channel to close').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for closing the ticket').setRequired(true))
		.addUserOption(option => option.setName('member').setDescription('The member who opened the ticket').setRequired(true)),
	async execute(interaction) {
		try {
			const ticket = await interaction.options.getChannel('ticket');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.options.getUser('member');
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const category = await interaction.guild.channels.cache.get(closedtickets);
			const logs = await interaction.guild.channels.cache.get(logsc);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send(`${interaction.user} tried to use close tickets command in ${interaction.guild}\n**ERROR:**\nLogs not found`).catch(O_o => console.log(O_o));
			if (!category) return interaction.reply({ content: `Closed tickets category not found`, ephemeral: true });
			if (ticket.Parent === category) return interaction.reply({ content: 'Ticket is already closed', ephemeral: true });

			// close
			await ticket.setParent(category);
			const oldname = await ticket.name;
			await ticket.setName(`(CLOSED)${oldname}`);

			// send embeds
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`Your ticket in ${interaction.guild} has been closed`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#572eff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
				.setTimestamp();

			await member.send({ embeds: [dmembed] }).catch(O_o => console.log(O_o));

			const tclosedembed = new Discord.MessageEmbed()
				.setTitle(`:file_cabinet:**Ticket Closed**:file_cabinet:`)
				.setDescription(`_ _\n**Ticket:** ${ticket}\n\n**Ticket name:**${ticket.name}\n\n**Closed by:** ${author}\n\n**Opened by:** ${member}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#572eff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
				.setTimestamp();

			await logs.send({ embeds: [tclosedembed] }).catch(O_o => me.send(`${interaction.user} tried to use close ticket command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.reply({ content: `Ticket closed`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
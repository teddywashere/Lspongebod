const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, errorc, opentickets, closedtickets } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delticket')
		.setDescription('(ADMIN) Delete a ticket')
		.setDefaultPermission(false)
		.addChannelOption(option => option.setName('ticket').setDescription('The ticket channel to delete').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Deleting...`, ephemeral: true });

			const ticket = await interaction.options.getChannel('ticket');
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const logs = await interaction.guild.channels.cache.get(logsc);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first');
			if (!logs || !author) await error.send(`Couldn't find either log channel and/or "author"`);
			if (ticket.parentId != closedtickets && ticket.parentId != opentickets) return interaction.editReply({ content: `Please make sure the channel you want to delete is a ticket`, ephemeral: true });

			const delembed = new Discord.MessageEmbed()
				.setTitle(`:no_entry_sign:**Ticket deleted**:no_entry_sign:`)
				.setDescription(`_ _\n**Ticket:** ${ticket.name}\n\n**Deleted by:** ${author}\n_ _`)
				.setColor('#3297ff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725752640856104/Screenshot_20211123-162553_1.png')
				.setTimestamp();

			await logs.send({ embeds: [delembed] }).catch(O_o => error.send(`${O_o}`));

			await ticket.delete();

			return interaction.editReply({ content: `Ticket deleted`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
		}

	},
};
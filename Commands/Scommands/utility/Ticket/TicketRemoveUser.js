const Discord = require('discord.js');
const { logsc, opentickets, closedtickets, errorc } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const member = await interaction.options.getUser('member');
			const ticket = await interaction.options.getChannel('ticket');
			const logs = await interaction.guild.channels.cache.get(logsc);
			const error = await interaction.guild.channels.cache.get(errorc);

			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send(`Logging channel not found`);
			if (ticket.parentId != opentickets && ticket.parentId != closedtickets) return interaction.editReply({ content: `Are you sure the channel you tagged is a ticket?`, ephemeral: true });

			// REMOVE USER FROM TICKET
			ticket.permissionOverwrites.delete(member.id, {
				VIEW_CHANNEL: false,
			});

			const logsembed = new Discord.MessageEmbed()
				.setTitle(`:nesting_dolls:**Member removed from Ticket**:nesting_dolls:`)
				.setDescription(`_ _\n**Member:** ${member}\n**Tag:** ${member.username}\n**ID:** \`${member.id}\`\n\n**Ticket:** ${ticket}\n${ticket.name}\n\n**Removed by:** ${interaction.user}\n_ _`)
				.setColor('#5dc9a9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917101187617157170/38.png')
				.setTimestamp();

			await logs.send({ embeds: [logsembed] }).catch(O_o => error.send(`${O_o}`));

			return interaction.editReply({ content: `${member} removed from ${ticket}`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

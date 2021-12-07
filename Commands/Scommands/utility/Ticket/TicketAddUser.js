const Discord = require('discord.js');
const { logsc, opentickets, closedtickets, errorc } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const target = await interaction.options.getUser('member');
			const ticket = await interaction.options.getChannel('ticket');
			const logs = await interaction.guild.channels.cache.get(logsc);
			const error = await interaction.guild.channels.cache.get(errorc);

			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send(`Logging channel not found!`);
			if (ticket.parentId != opentickets && ticket.parentId != closedtickets) return interaction.editReply({ content: `Are you sure the channel you tagged is a ticket?`, ephemeral: true });

			// ADD MEMBER TO TICKET
			ticket.permissionOverwrites.create(target.id, {
				VIEW_CHANNEL: true,
				SEND_MESSAGES: true,
			});

			const logsembed = new Discord.MessageEmbed()
				.setTitle(`:dolls:**Member added to Ticket**:dolls:`)
				.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Ticket:** ${ticket}\n${ticket.name}\n\n**Added by:** ${interaction.user}\n_ _`)
				.setColor('#3fd2d7')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917101187835256892/1400x700-5-16-1.jpg')
				.setTimestamp();

			await logs.send({ embeds: [logsembed] }).catch(O_o => error.send(`${O_o}`));

			return interaction.editReply({ content: `${target} added to ${ticket}`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

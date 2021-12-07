const Discord = require('discord.js');

const { opentickets, closedtickets, logsc, errorc } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const ticket = await interaction.options.getChannel('ticket');
			const oldname = await ticket.name;
			const newname = await interaction.options.getString('name');
			const logs = await interaction.guild.channels.cache.get(logsc);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send({ content: `Logs not found` });
			if (ticket.parentId != opentickets && ticket.parentId != closedtickets) return interaction.editReply({ content: 'Please make sure the channel you want to rename is a ticket.', ephemeral: true });

			await ticket.setName(newname);

			const renamembed = new Discord.MessageEmbed()
				.setTitle(`:pencil:**Ticket Renamed** :pencil:`)
				.setDescription(`_ _\n**Ticket:** ${ticket}\n\n**Old** **Name:** ${oldname}\n\n**New** **Name:** ${newname}\n\n**Renamed** **by:** ${interaction.user}\n_ _`)
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/915190372152528936/DoodleBob.Pencil.jpg')
				.setColor('#64b4ff')
				.setTimestamp();

			await logs.send({ embeds: [renamembed] }).catch(O_o => error.send(`${O_o}`));
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

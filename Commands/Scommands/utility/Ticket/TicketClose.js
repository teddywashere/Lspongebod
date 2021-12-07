/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const Discord = require('discord.js');

const { closedtickets, logsc, errorc, opentickets } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const ticket = await interaction.options.getChannel('ticket');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.options.getUser('member');
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const category = await interaction.guild.channels.cache.get(closedtickets);
			const logs = await interaction.guild.channels.cache.get(logsc);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send(`Logs not found`);
			if (!category) return interaction.reply({ content: `Closed tickets category not found`, ephemeral: true });
			if (ticket.parentId === closedtickets) return interaction.reply({ content: 'Ticket is already closed', ephemeral: true });
			if (ticket.parentId != opentickets) return interaction.editReply({ content: `Please make sure the channel you want to close is an open ticket`, ephemeral: true });

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

			const tclosedembed = new Discord.MessageEmbed()
				.setTitle(`:file_cabinet:**Ticket Closed**:file_cabinet:`)
				.setDescription(`_ _\n**Ticket:** ${ticket}\n\n**Ticket name:**${ticket.name}\n\n**Closed by:** ${author}\n\n**Opened by:** ${member}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#572eff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
				.setTimestamp();

			await member.send({ embeds: [dmembed] }).catch(O_o => {});
			await logs.send({ embeds: [tclosedembed] }).catch(O_o => error.send(`${O_o}`));

			return interaction.reply({ content: `Ticket closed`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

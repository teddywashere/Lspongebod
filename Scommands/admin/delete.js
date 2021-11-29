const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delticket')
		.setDescription('(ADMIN) Delete a ticket')
		.setDefaultPermission(false)
		.addChannelOption(option => option.setName('ticket').setDescription('The ticket channel to delete').setRequired(true)),
	async execute(interaction) {
		try {
			interaction.reply({ content: `Deleting...`, ephemeral: true });

			const ticket = await interaction.options.getChannel('ticket');
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const logs = await interaction.guild.channels.cache.get(logsc);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs || !author) await me.send(`${author} tried to use the delete ticket command in ${interaction.guild}\n**ERROR:**\n Couldn't find either log channel and/or "author"`).catch(O_o => console.log(O_o));

			const delembed = new Discord.MessageEmbed()
				.setTitle(`:no_entry_sign:**Ticket deleted**:no_entry_sign:`)
				.setDescription(`_ _\n**Ticket:** ${ticket.name}\n\n**Deleted by:** ${author}\n_ _`)
				.setColor('#3297ff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725752640856104/Screenshot_20211123-162553_1.png')
				.setTimestamp();

			await logs.send({ embeds: [delembed] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			await ticket.delete();

			return interaction.editReply({ content: `Ticket deleted`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
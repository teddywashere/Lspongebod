const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { logsc, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('(STAFF) Purge up to 99 messages.')
		.setDefaultPermission(false)
		.addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune').setRequired(true)),
	async execute(interaction) {
		try {
			interaction.reply({ content: `Deleting...`, ephemeral: true });

			const amount = await interaction.options.getInteger('amount');
			const logs = await interaction.guild.channels.cache.get(logsc);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send(`${interaction.user} tried to use prune command in ${interaction.guild}\n**ERROR:**\nLogs not found`).catch(O_o => console.log(O_o));
			if (amount <= 1 || amount > 100) return interaction.editReply({ content: 'You can only delete at least 1 and at most 99 messages.', ephemeral: true });

			// delete messages
			await interaction.channel.bulkDelete(amount, true);

			// modlog and reply
			const pruneEmbed = new Discord.MessageEmbed()
				.setTitle(`:wastebasket:**${amount} Messages deleted**:wastebasket:`)
				.setDescription(`_ _\n**Deleted in:** ${interaction.channel}\n\n**Deleted by:** ${interaction.user}\n\n**ID:** \`${interaction.user.id}\``)
				.setColor('#4374f9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567684846645248/prune.jpg')
				.setTimestamp();

			await logs.send({ embeds: [pruneEmbed] }).catch(O_o => me.send(`${interaction.user} tried to use prune command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `Successfully deleted ${amount} messages`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}
	},
};
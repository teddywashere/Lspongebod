const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { logsc, errorc } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('(STAFF) Purge up to 99 messages.')
		.setDefaultPermission(false)
		.addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Deleting...`, ephemeral: true });

			const amount = await interaction.options.getInteger('amount');
			const logs = await interaction.guild.channels.cache.get(logsc);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send(`Logs not found`);
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

			await logs.send({ embeds: [pruneEmbed] }).catch(O_o => error.send(`${O_o}`));

			return interaction.editReply({ content: `Successfully deleted ${amount} messages`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}
	},
};
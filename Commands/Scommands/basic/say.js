const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, errorc } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Sends the message you want')
		.setDefaultPermission(false)
		.addStringOption(option => option.setName('message').setDescription('The message you want me to send').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Typing...`, ephemeral: true });

			const message = await interaction.options.getString('message');
			const logs = await interaction.guild.channels.cache.get(logsc);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first');
			if (!logs) await error.send(`Logs channel not found, please do the setup!`);

			await interaction.channel.send(`${message}`);

			const logembed = new Discord.MessageEmbed()
				.setTitle(`**Say Used**`)
				.setDescription(`Used by ${interaction.user}\n${interaction.user.tag}\n\`${interaction.user.id}\`\n\n Message: \`${message}\``)
				.setTimestamp();

			await logs.send({ embeds: [logembed] }).catch(O_o => error.send(`${O_o}`));
			return interaction.editReply({ content: `Done.`, ephemeral: true });
		}
		catch (O_o) {
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
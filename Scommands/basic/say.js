const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { logsc, owner } = require('./../../config.json');

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

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send(`${interaction.user} tried to use Say command in ${interaction.guild}\n**ERROR:**\nLog channel not found`).catch(O_o => console.log(O_o));

			await interaction.channel.send(`${message}`);

			const logembed = new Discord.MessageEmbed()
				.setTitle(`**Say Used**`)
				.setDescription(`Used by ${interaction.user}\n${interaction.user.tag}\n\`${interaction.user.id}\`\n\n Message: \`${message}\``)
				.setTimestamp();

			await logs.send({ embeds: [logembed] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
			return interaction.editReply({ content: `Done.`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
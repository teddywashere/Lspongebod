const Discord = require('discord.js');
const colors = require('./colors.json');

module.exports = {
	async execute(interaction) {
		try {
			const title = await interaction.options.getString('title');
			const description = await interaction.options.getString('description');
			const color = await interaction.options.getString('color');
			const channel = await interaction.options.getChannel('channel');

			// COLOR RANDOM
			if (color === 'RANDOM') {
				const rbasicembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color);

				if (channel) {
					await channel.send({ embeds: [rbasicembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [rbasicembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR HEX CODE
			if (color.includes('#')) {
				const sbasicembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color);

				if (channel) {
					await channel.send({ embeds: [sbasicembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [sbasicembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR FROM MAP
			if (color != 'RANDOM' || color.startsWith() != '#') {
				const mapcolor = colors[`${color.toLowerCase()}`];
				const mbasicembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(mapcolor);

				if (channel) {
					await channel.send({ embeds: [mbasicembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [mbasicembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

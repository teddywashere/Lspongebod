const Discord = require('discord.js');
const colors = require('./colors.json');

module.exports = {
	async execute(interaction) {
		try {
			const title = await interaction.options.getString('title');
			const description = await interaction.options.getString('description');
			const color = await interaction.options.getString('color');
			const thumbnail = await interaction.options.getString('thumbnail');
			const channel = await interaction.options.getChannel('channel');

			// COLOR RANDOM
			if (color === 'RANDOM') {
				const rthumbnailembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setThumbnail(`${thumbnail}`);

				if (channel) {
					await channel.send({ embeds: [rthumbnailembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [rthumbnailembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR HEX CODE
			if (color.includes('#')) {
				const sthumbnailembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setThumbnail(`${thumbnail}`);

				if (channel) {
					await channel.send({ embeds: [sthumbnailembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [sthumbnailembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR FROM MAP
			if (color != 'RANDOM' || color.startsWith() != '#') {
				const mapcolor = colors[`${color.toLowerCase()}`];

				const mthumbnailembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(mapcolor)
					.setThumbnail(`${thumbnail}`);

				if (channel) {
					await channel.send({ embeds: [mthumbnailembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [mthumbnailembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

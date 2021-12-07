const Discord = require('discord.js');
const colors = require('./colors.json');

module.exports = {
	async execute(interaction) {
		try {
			const title = await interaction.options.getString('title');
			const description = await interaction.options.getString('description');
			const color = await interaction.options.getString('color');
			const image = await interaction.options.getString('image');
			const channel = await interaction.options.getChannel('channel');

			// COLOR RANDOM
			if (color === 'RANDOM') {

				const rimageonembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setImage(`${image}`);

				if (channel) {
					await channel.send({ embeds: [rimageonembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [rimageonembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR HEX CODE
			if (color.includes('#')) {

				const simageonembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setImage(`${image}`);

				if (channel) {
					await channel.send({ embeds: [simageonembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [simageonembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR FROM MAP
			if (color != 'RANDOM' || color.startsWith() != '#') {
				const mapcolor = colors[`${color.toLowerCase()}`];


				const mimageonembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(mapcolor)
					.setImage(`${image}`);

				if (channel) {
					await channel.send({ embeds: [mimageonembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [mimageonembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

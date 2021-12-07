const Discord = require('discord.js');
const colors = require('./colors.json');

module.exports = {
	async execute(interaction) {
		try {
			const title = await interaction.options.getString('title');
			const description = await interaction.options.getString('description');
			const color = await interaction.options.getString('color');
			const footer = await interaction.options.getString('footer');
			const channel = await interaction.options.getChannel('channel');

			// COLOR RANDOM
			if (color === 'RANDOM') {
				const rfooterembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setFooter(`${footer}`);
				if (channel) {
					await channel.send({ embeds: [rfooterembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [rfooterembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR HEX CODE
			if (color.includes('#')) {
				const sfooterembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setFooter(`${footer}`);

				if (channel) {
					await channel.send({ embeds: [sfooterembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [sfooterembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
			// COLOR FROM MAP
			if (color != 'RANDOM' || color.startsWith() != '#') {
				const mapcolor = colors[`${color.toLowerCase()}`];

				const mfooterembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(mapcolor)
					.setFooter(`${footer}`);

				if (channel) {
					await channel.send({ embeds: [mfooterembed] });
					return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
				}
				if (!channel) {
					await interaction.channel.send({ embeds: [mfooterembed] });
					return interaction.editReply({ content: 'Embed send.', ephemeral: true });
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

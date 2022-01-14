const Discord = require('discord.js');
const colors = require('./colors.json');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });
			const text = await interaction.options.getString('text');
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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [rthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [rthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [rthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [rthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [sthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [sthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [sthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [sthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [mthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [mthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [mthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [mthumbnailembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

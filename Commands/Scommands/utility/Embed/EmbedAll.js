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
			const footer = await interaction.options.getString('footer');
			const channel = await interaction.options.getChannel('channel');

			// COLOR RANDOM
			if (color === 'RANDOM') {
				const rallembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setThumbnail(`${thumbnail}`)
					.setFooter(`${footer}`);

				if (channel) {
					if (text) {
						await channel.send({ content: `${text}`, embeds: [rallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!text) {
						await channel.send({ embeds: [rallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
				}
				if (!channel) {
					if (text) {
						await interaction.channel.send({ content: `${text}`, embeds: [rallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
					if (!text) {
						await interaction.channel.send({ embeds: [rallembed] });
						return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
					}
				}
			}
			// COLOR HEX CODE
			if (color.includes('#')) {
				const sallembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(color)
					.setThumbnail(`${thumbnail}`)
					.setFooter(`${footer}`);

					if (channel) {
						if (text) {
							await channel.send({ content: `${text}`, embeds: [sallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [sallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [sallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [sallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
			}
			// COLOR FROM MAP
			if (color != 'RANDOM' || color.startsWith() != '#') {
				const mapcolor = colors[`${color.toLowerCase()}`];

				const mallembed = new Discord.MessageEmbed()
					.setTitle(`${title}`)
					.setDescription(`${description}`)
					.setColor(mapcolor)
					.setThumbnail(`${thumbnail}`)
					.setFooter(`${footer}`);

					if (channel) {
						if (text) {
							await channel.send({ content: `${text}`, embeds: [mallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [mallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [mallembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [mallembed] });
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

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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [rfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [rfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [rfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [rfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [sfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [sfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [sfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [sfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
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
						if (text) {
							await channel.send({ content: `${text}`, embeds: [mfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await channel.send({ embeds: [mfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
					}
					if (!channel) {
						if (text) {
							await interaction.channel.send({ content: `${text}`, embeds: [mfooterembed] });
							return interaction.editReply({ content: `Embed send to ${channel}`, ephemeral: true });
						}
						if (!text) {
							await interaction.channel.send({ embeds: [mfooterembed] });
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

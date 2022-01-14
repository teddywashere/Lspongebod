/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
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
			const colorsembed = new Discord.MessageEmbed()
				.setTitle(`**All precoded colors**`)
				.setDescription(`_ _\nReact with the colored emojis, to see you options of that color\n\nWhen using the other embed commands, you can set these color names as the color option.\n_ _`)
				.setImage('https://cdn.discordapp.com/attachments/772471934231117834/914888708287787088/Screenshot_20211129-154047_1.png');

			const blueembed = new Discord.MessageEmbed()
				.setTitle(`**All available blues**`)
				.setDescription(`> lightblue\n> brightblue\n> darkblue`)
				.setColor('#2a9df4');

			const redembed = new Discord.MessageEmbed()
				.setTitle(`**All available reds**`)
				.setDescription(`> lightred\n> brightred\n> darkred`)
				.setColor('#ff0000');

			const yellowembed = new Discord.MessageEmbed()
				.setTitle(`**All available yellows**`)
				.setDescription(`> lightyellow\n> brightyellow\n> darkyellow`)
				.setColor('#ffff00');

			const greenembed = new Discord.MessageEmbed()
				.setTitle(`**All available greens**`)
				.setDescription(`> lightgreen\n> brightgreen\n> darkgreen`)
				.setColor('#00ff00');

			const orangeembed = new Discord.MessageEmbed()
				.setTitle(`**All available oragnes**`)
				.setDescription(`> lightorange\n> brightorange\n> darkorange`)
				.setColor('#ff6600');

			const pinkembed = new Discord.MessageEmbed()
				.setTitle(`**All available pinks**`)
				.setDescription(`> lightpink\n> brightpink\n> darkpink`)
				.setColor('#f61e61');

			const purpleembed = new Discord.MessageEmbed()
				.setTitle(`**All available purples**`)
				.setDescription(`> lightpurple\n> brightpurple\n> darkpurple`)
				.setColor('#800080');

			const embed = await interaction.channel.send({ embeds: [colorsembed] });
			Promise.all([
				await embed.react('💙'),
				await embed.react('❤️'),
				await embed.react('💛'),
				await embed.react('💚'),
				await embed.react('🧡'),
				await embed.react('🩰'),
				await embed.react('💜'),
			])
				.catch(error => console.error('One of the emojis failed to react:', error));

			const filter = (reaction, user) => {
				return ['💙', '❤️', '💛', '💚', '🧡', '🩰', '💜'].includes(reaction.emoji.name) && user.id === interaction.user.id;

			};

			await embed.awaitReactions({ filter, max:1, time: 60000, errors: ['time'] })
				.then(collected => {
					console.log(collected);
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(collected => {
					console.log(collected);
				});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.awaitReactions({ filter, maxEmojis: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					if (collected.has('💙')) {
						embed.edit({ embeds: [blueembed] });
					}
					if (collected.has('❤️')) {
						embed.edit({ embeds: [redembed] });
					}
					if (collected.has('💛')) {
						embed.edit({ embeds: [yellowembed] });
					}
					if (collected.has('💚')) {
						embed.edit({ embeds: [greenembed] });
					}
					if (collected.has('🧡')) {
						embed.edit({ embeds: [orangeembed] });
					}
					if (collected.has('🩰')) {
						embed.edit({ embeds: [pinkembed] });
					}
					if (collected.has('💜')) {
						embed.edit({ embeds: [purpleembed] });
					}
				})
				.catch(O_o => {});

			await embed.reactions.removeAll().catch(O_o => {});
			return interaction.editReply({ content:`Hope you found something.\nIf not feel free to use this command again or make a suggestion for a new color to add.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

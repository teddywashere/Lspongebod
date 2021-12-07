const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

const { MessageSelectMenu } = require('discord.js');

const { modlogc, errorc, token } = require('../../../../config.json');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Warns = require('../../../../DatabaseModels/Warns')(sequelize, Sequelize);

// ONLY THING LEFT IS EMBEDS AND A PROPER CATCH. (CANCEL DOESN'T WORK FOR SOME REASON...)

module.exports = {
	async execute(interaction) {
		try {
			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');
			const name = target.id;
			const modlog = interaction.guild.channels.cache.get(modlogc);
			const error = interaction.guild.channels.cache.get(errorc);

			if (!error) return interaction.channel.send('please do the setup!');
			if (!modlog) return error.send('Modlog not found.');

			// get all warns of a user
			const userwarns = await Warns.findAll({ where: { user_id: target.id } });

			// get list of warn number | warn reason
			const first = userwarns.find(warn => warn.warn === 1);
			const second = userwarns.find(warn => warn.warn === 2);

			if (!first) return interaction.editReply({ content: `${target} has never been warned`, ephemeral: true });

			// FIRST WARN
			if (!second) {
				const menu1 = new Discord.MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('primary')
							.setPlaceholder('Tap to select warn')
							.addOptions([
								{
									label: 'First warn',
									description: `${first.reason}`,
									value: 'first_option',
									default: true,
								},
								{
									label: 'Cancel',
									description: 'Select to cancel',
									value: 'cancel',
								},
							]),
					);

				await interaction.editReply({ content: `**__Found user:__**\n\n${target.username}\n\`${target.id}\`\n\nPlease select the warn you want to remove in the menu below.`, ephemeral: true, components: [menu1] });

				client.once('interactionCreate', i => {
					if (!i.isSelectMenu()) return;
					if (i.values.find(o => o === 'first_option')) {
						const rowCount = Warns.destroy({ where: { id: first.id } });
						if (!rowCount) return interaction.editReply('That tag did not exist.');

						const warnremovembed = new Discord.MessageEmbed()
							.setTitle(`:eyes:**Warn removed**:eyes:`)
							.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** 1\n**Warn Reason:** ${first.reason}\n\n**Removed by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#31bf4b')
							.setThumbnail(target.displayAvatarURL())
							.setTimestamp();

						const dmembed = new Discord.MessageEmbed()
							.setTitle(`Warn removed in ${interaction.guild}`)
							.setDescription(`Your 1 warn has been removed by ${interaction.user}`)
							.setColor('#31bf4b')
							.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917695438885371904/590103042.jpg')
							.setTimestamp();

						target.send({ embeds: [dmembed] }).catch(O_o => console.log(O_o));
						modlog.send({ embeds: [warnremovembed] }).catch(O_o => error.send(`${O_o}`));

						return interaction.editReply({ content: `Removed ${target}s first warn\n\nThey now have 0 warns.`, ephemeral: true, components: [] });
					}
					if (i.values.find(o => o === 'cancel')) {
						return interaction.editReply({ content: 'Canceled', ephemeral: true, components: [] });
					}
				});
			}

			// SECOND WARN
			if (first && second) {
				const menu2 = new Discord.MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('primary')
							.setPlaceholder('Tap to select warn')
							.addOptions([
								{
									label: 'First warn',
									description: `${first.reason}`,
									value: 'first_option',
								},
								{
									label: 'Second warn',
									description: `${second.reason}`,
									value: 'second_option',
								},
								{
									label: 'Cancel',
									description: 'Select to cancel',
									value: 'cancel',
								},
							]),
					);

				await interaction.editReply({ content: `**__Found user:__**\n\n${target.username}\n\`${target.id}\`\n\nPlease select the warn you want to remove in the menu below.`, ephemeral: true, components: [menu2] });
				client.once('interactionCreate', i => {
					if (!i.isSelectMenu()) return;
					if (i.values.find(o => o === 'first_option')) {
						const rowCount = Warns.destroy({ where: { id: first.id } });
						if (!rowCount) return interaction.editReply('That tag did not exist.');
						Warns.update({ warn: 1 }, { where: { user_id: name, warn: 2 } });

						const warnremovembed = new Discord.MessageEmbed()
							.setTitle(`:eyes:**Warn removed**:eyes:`)
							.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** 2\n**Warn Reason:** ${first.reason}\n\n**Removed by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#31bf4b')
							.setThumbnail(target.displayAvatarURL())
							.setTimestamp();

						const dmembed = new Discord.MessageEmbed()
							.setTitle(`Warn removed in ${interaction.guild}`)
							.setDescription(`Your 2 warn has been removed by ${interaction.user}`)
							.setColor('#31bf4b')
							.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917695438885371904/590103042.jpg')
							.setTimestamp();

						target.send({ embeds: [dmembed] }).catch(O_o => console.log(O_o));
						modlog.send({ embeds: [warnremovembed] }).catch(O_o => error.send(`${O_o}`));

						return interaction.editReply({ content: `${target}s first warn removed.\n\nThey now have 1 warn`, ephemeral: true, components: [] });
					}
					if (i.values.find(o => o === 'second_option')) {
						const rowCount = Warns.destroy({ where: { id: second.id } });
						if (!rowCount) return interaction.editReply('That tag did not exist.');

						const warnremovembed = new Discord.MessageEmbed()
							.setTitle(`:eyes:**Warn removed**:eyes:`)
							.setDescription(`_ _\n**Member:** ${target}\n**Tag:** ${target.username}\n**ID:** \`${target.id}\`\n\n**Warn:** 2\n**Warn Reason:** ${second.reason}\n\n**Removed by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
							.setColor('#31bf4b')
							.setThumbnail(target.displayAvatarURL())
							.setTimestamp();

						const dmembed = new Discord.MessageEmbed()
							.setTitle(`Warn removed in ${interaction.guild}`)
							.setDescription(`Your 2 warn has been removed by ${interaction.user}`)
							.setColor('#31bf4b')
							.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917695438885371904/590103042.jpg')
							.setTimestamp();

						target.send({ embeds: [dmembed] }).catch(O_o => console.log(O_o));
						modlog.send({ embeds: [warnremovembed] }).catch(O_o => error.send(`${O_o}`));


						return interaction.editReply({ content: `${target}s second warn removed.\n\nThey now have 1 warn`, ephemeral: true, components: [] });
					}
					if (i.values.find(o => o === 'cancel')) {
						return interaction.editReply({ content: 'Canceled.', ephemeral: true, components: [] });
					}
				});
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
client.login(token);

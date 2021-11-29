const { Permissions } = require('discord.js');
const Discord = require('discord.js');

const { logsc, opentickets, ticketsc, jailr, staffr, everyoner, logger, owner } = require('./../../config.json');

module.exports = {
	name: 'suggest',
	description: 'Opens suggestion ticket',
	guildOnly: true,
	async execute(message) {
		try {
			const member = message.guild.members.cache.get(message.author.id);

			const logs = message.guild.channels.cache.get(logsc);
			const category = message.guild.channels.cache.get(opentickets);
			const ticketc = message.guild.channels.cache.get(ticketsc);
			const staff = message.guild.roles.cache.get(staffr);

			const me = message.guild.members.cache.get(owner);
			if (!logs) await me.send(`${message.author} tried to use suggestion ticket command in ${message.guild}\n**ERROR:**\nLogs channel not found`).catch(O_o => console.log(O_o));

			if (!message.guild.roles.cache.get(jailr)) return message.reply({ content: `Jail role not found` });
			if (!staff) return message.reply({ content: `Staff role not found` });
			if (!ticketc) return message.reply({ content: 'Ticket channel not found' });
			if (!category) return message.reply({ content: 'Open tickets category not found' });
			if (!message.guild.roles.cache.get(everyoner)) return message.reply({ content: 'Everyone role not found' });

			if (member.roles.cache.has(jailr)) return message.reply({ content: `You're in jail so you can only verify` });
			if (message.channel != ticketc) return message.reply({ content: `Please only use this command in ${ticketc}.\n If you try to do this again, moderators will mute you.` });

			// !!!THE OPEN TICKET CHECK SEEMS TO BE BROKEN?
			const name = await message.author.username.toLowerCase();
			const disc = await message.author.discriminator.toString();
			const channel = await message.guild.channels.cache.find(c => c.name === `suggestion-${name}${disc}`);
			if (channel && channel.ParentId === opentickets) return message.reply(`You already have an open suggestion ticket!\n${channel}`);

			// make private ticket
			await message.guild.channels.create(`suggestion - ${message.author.tag}`, {
				parent: category,
				permissionOverwrites: [
					{
						id: message.author,
						allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
					},
					{
						id: staffr,
						allow: [Permissions.FLAGS.VIEW_CHANNEL],
					},
					{
						id: logger,
						allow: [Permissions.FLAGS.VIEW_CHANNEL],
					},
					{
						id: everyoner,
						deny: [Permissions.FLAGS.VIEW_CHANNEL],
					},
				],
			}).then(c => c.send(`${member} ${staff}`));

			// send logs
			const ticket = await message.guild.channels.cache.find(c => c.name === `suggestion-${name}${disc}`);
			const verifyembed = new Discord.MessageEmbed()
				.setTitle(`:incoming_envelope:**Suggestion ticket opened**:incoming_envelope:`)
				.setDescription(`_ _\n**Member:** ${message.author}\n\n **Ticket:** ${ticket}\n_ _`)
				.setColor('#00d1dc')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912711230391722064/Screenshot_20211123-152732_1.png')
				.setTimestamp();

			await logs.send({ embeds: [verifyembed] }).catch(O_o => me.send(`${message.author} tried to use suggestion ticket command in ${message.guild}\n**ERROR:**\n${O_o}`));

			return message.reply({ content: `Your suggestion ticket has been created!` });
		}
		catch (error) {
			console.error(error);
			message.reply({ content: `**Something went wrong... Sorry**\n${error}!` });
		}
	},
};

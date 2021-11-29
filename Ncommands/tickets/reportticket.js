const { Permissions } = require('discord.js');
const Discord = require('discord.js');

const { logsc, opentickets, ticketsc, logger, jailr, staffr, everyoner, owner } = require('./../../config.json');

module.exports = {
	name: 'report',
	description: 'Opens report ticket',
	guildOnly: true,
	async execute(message) {
		try {
			const member = message.guild.members.cache.get(message.author.id);
			const logs = message.guild.channels.cache.get(logsc);
			const category = message.guild.channels.cache.get(opentickets);
			const tickets = message.guild.channels.cache.get(ticketsc);
			const staff = message.guild.roles.cache.get(staffr);

			const me = message.guild.members.cache.get(owner);
			if (!logs) await me.send(`${message.author} tried to use reportticket command in ${message.guild}\n**ERROR:**\n Logs channel not found`).catch(O_o => console.log(O_o));

			if (!message.guild.roles.cache.get(jailr)) return message.reply({ content: `Jail role not found`, ephemeral: true });
			if (!staff) return message.reply({ content: `Staff role not found`, ephemeral: true });
			if (!message.guild.roles.cache.get(everyoner)) return message.reply({ content: `Everyone role not found`, ephemeral: true });
			if (!tickets) return message.reply({ content: `Tickets channel not found`, ephemeral: true });
			if (!category) return message.reply({ content: `Open tickets category not found` });

			if (member.roles.cache.has(jailr)) return message.reply({ content: `You're in jail, you can only verify.` });
			if (message.channel != tickets) return message.reply({ content: `Please only use this command in ${tickets}.\n If you try to do this again, moderators will mute you.` });

			// !!!THE OPEN TICKET CHECK SEEMS TO BE BROKEN?
			const name = await message.author.username.toLowerCase();
			const disc = await message.author.discriminator.toString();
			const channel = await message.guild.channels.cache.find(c => c.name === `report-${name}${disc}`);
			if (channel && channel.ParentId === opentickets) return message.reply(`You already have an open report ticket!\n${channel}`);

			// make private ticket
			await message.guild.channels.create(`report-${message.author.tag}`, {
				parent: category,
				permissionOverwrites: [
					{
						id: message.author.id,
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
			const reportembed = new Discord.MessageEmbed()
				.setTitle(`:oncoming_police_car:**Report ticket opened**:oncoming_police_car:`)
				.setDescription(`_ _\n**Member:** ${message.author}\n\n **Ticket:** ${ticket}\n_ _`)
				.setColor('#ff610c')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912711229955526727/Screenshot_20211123-152807_1.png')
				.setTimestamp();

			await logs.send({ embeds: [reportembed] }).catch(O_o => me.send(`${message.author} tried to use reportticket command in ${message.guild}\n**ERROR:**\n${O_o}`));

			return message.reply({ content: `Your report ticket has been created!` });
		}
		catch (error) {
			console.error(error);
			message.reply({ content: `**Something went wrong... Sorry**\n${error}!` });
		}
	},
};

const { Permissions } = require('discord.js');
const Discord = require('discord.js');

const { logsc, opentickets, jailr, staffr, everyoner, logger, owner } = require('../../../config.json');

module.exports = {
	name: 'verify',
	description: 'Opens age verification ticket',
	async execute(message) {
		try {
			const member = await message.guild.members.cache.get(message.author.id);
			const logs = await message.guild.channels.cache.get(logsc);
			const category = await message.guild.channels.cache.get(opentickets);
			const staff = await message.guild.roles.cache.get(staffr);

			const me = await message.guild.members.cache.get(owner);
			if (!logs) await me.send(`${message.author} tried to use verify ticket command in ${message.guild}\n**ERROR:**\nLogs channel not found`).catch(O_o => console.log(O_o));

			if (!message.guild.roles.cache.get(jailr)) return message.reply({ content: `Jail role not found` });
			if (!staff) return message.reply({ content: `Staff role not found` });
			if (!category) return message.reply({ content: 'Open tickets category not found' });
			if (!message.guild.roles.cache.get(everyoner)) return message.reply({ content: 'Everyone role not found' });
			if (!member.roles.cache.has(jailr)) return message.reply({ content: `You're not in jail so you don't need to verify` });

			// !!!THE OPEN TICKET CHECK SEEMS TO BE BROKEN?
			const name = await message.author.username.toLowerCase();
			const disc = await message.author.discriminator.toString();
			const channel = await message.guild.channels.cache.find(c => c.name === `verify-${name}${disc}`);
			if (channel && channel.parentId === opentickets) return message.reply(`You already have an open verification ticket!\n${channel}`);

			// make private ticket
			await message.guild.channels.create(`verify - ${message.author.tag}`, {
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
				.setTitle(`:shield:**Age verification ticket opened**:shield:`)
				.setDescription(`_ _\n**Member:** ${message.author}\n\n **Ticket:** ${ticket}\n_ _`)
				.setColor('#ffb81d')
				.setThumbnail('https://media.discordapp.net/attachments/772471934231117834/911718877988286464/3d8.jpg?width=661&height=661')
				.setTimestamp();

			await logs.send({ embeds: [verifyembed] }).catch(O_o => me.send(`${message.author} tried to use verify ticket command in ${message.guild}\n**ERROR:**\n${O_o}`));

			return message.reply({ content: `Your verification ticket has been created!` });
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: `**Something went wrong... Sorry**\n${error}!` });
		}

	},
};

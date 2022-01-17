const { Permissions } = require('discord.js');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);
const Ticket = require('../../../DatabaseModels/Tickets')(sequelize, Sequelize);

module.exports = {
	name: 'report',
	description: 'Opens report ticket',
	guildOnly: true,
	async execute(message) {
		try {
			const logger = '291194093495648258';
			const server = await Setup.findOne({ where: { guild_id: message.guild.id } });
			if (!server) return message.reply({ content: `Please do /setup error first` });
	

			const member = await message.guild.members.cache.get(message.author.id);
			if (!member) return message.reply('Member not found');
			const logs = await message.guild.channels.cache.get(server.logs_channel);
			const category = await message.guild.channels.cache.get(server.ticketopen_channel);
			const tickets = await message.guild.channels.cache.get(server.ticket_channel);
			const staff = await message.guild.roles.cache.get(server.staff_role);
			if (!message.guild.roles.cache.get(server.everyone_role)) return message.reply({ content: 'Everyone role not found' });

			if(message.guild.roles.cache.get(server.jail_role)) {
				if (member.roles.cache.has(server.jail_role)) return message.reply({ content: `You're in jail so you can only verify` });
			}

			if (tickets) {
				if (message.channel != tickets) return message.reply({ content: `Please only use this command in ${tickets}.\n If you try to do this again, moderators will mute you.` });
			}

			const ticket = await Ticket.findOne({ where: { user_id: message.author.id, guild_id: message.guild.id, status: 'open', type: 'report' } });
			if (ticket) return message.reply({ content: `You already have an open ticket ${message.guild.channels.cache.find(ticket.channel_id)}`});

			const all = await Ticket.findAll({ where: { guild_id: message.guild.id, status: 'open', type: 'report' } });
			const array = await all.map(n => n.number);
			const number = array.length + 1;

			if (server.ticket_name === 'username') {
				if (category) {
					if (staff) {
						const make = await message.guild.channels.create(`report-${message.author.tag}`, {
							parent: category,
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: server.staff_role,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.author} ${staff}`)
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
					if (!staff) {
						const make = await message.guild.channels.create(`report-${message.author.tag}`, {
							parent: category,
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.guild.roles.cache.get(server.everyone_role)}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
				}
				if (!category) {
					if (staff) {
						const make = await message.guild.channels.create(`report-${message.author.tag}`, {
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: server.staff_role,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${member} ${staff}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
					if (!staff) {
						const make = await message.guild.channels.create(`report-${message.author.tag}`, {
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.guild.roles.cache.get(server.everyone_role)}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
				}
				const made = message.guild.channels.find(n => n === `report${message.author.tag}`)
					const reportembed = new Discord.MessageEmbed()
				.setTitle(`:oncoming_police_car:**Report ticket opened**:oncoming_police_car:`)
				.setDescription(`_ _\n**Member:** ${message.author}\n\n **Ticket:** ${made}\n_ _`)
				.setColor('#ff610c')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912711229955526727/Screenshot_20211123-152807_1.png')
				.setTimestamp();

					await logs.send({ embeds: [reportembed] }).catch(O_o => {});
			}
			if (server.ticket_name === 'number') {

				if (category) {
					if (staff) {
						const make = await message.guild.channels.create(`report-${number}`, {
							parent: category,
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: server.staff_role,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.author} ${staff}`)
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
					if (!staff) {
						const make = await message.guild.channels.create(`report-${number}`, {
							parent: category,
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.guild.roles.cache.get(server.everyone_role)}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
				}
				if (!category) {
					if (staff) {
						const make = await message.guild.channels.create(`report-${number}`, {
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: server.staff_role,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${member} ${staff}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
					if (!staff) {
						const make = await message.guild.channels.create(`report-${number}`, {
							permissionOverwrites: [
								{
									id: message.author.id,
									allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
								},
								{
									id: logger,
									allow: [Permissions.FLAGS.VIEW_CHANNEL],
								},
								{
									id: server.everyone_role,
									deny: [Permissions.FLAGS.VIEW_CHANNEL],
								},
							],
						});
						make.send(`${message.guild.roles.cache.get(server.everyone_role)}`);
						return Ticket.create({
							user_id: message.author.id,
							channel_id: make.id,
							guild_id: message.guild.id,
							status: 'open',
							type: 'report',
							number: number,
						})
					}
				}
				const made = message.guild.channels.find(n => n === `report${number}`)
					const reportembed = new Discord.MessageEmbed()
				.setTitle(`:oncoming_police_car:**Report ticket opened**:oncoming_police_car:`)
				.setDescription(`_ _\n**Member:** ${message.author}\n\n **Ticket:** ${made}\n_ _`)
				.setColor('#ff610c')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912711229955526727/Screenshot_20211123-152807_1.png')
				.setTimestamp();

					await logs.send({ embeds: [reportembed] }).catch(O_o => {});
			}

			return message.reply({ content: `Your report ticket has been created!` });
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: `**Something went wrong... Sorry**\n${error}!` });
		}
	},
};

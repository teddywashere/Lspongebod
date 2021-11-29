const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix, token, guildId, generalc } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

// -----------------------------------------------------------------------------------------------------------------------------------
// command handler

// slash commands
client.commands = new Collection();

const commandFolders = fs.readdirSync('./Scommands');
for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./Scommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./Scommands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}

// normal commands
const ncommandFolders = fs.readdirSync('./Ncommands');
for (const folder of ncommandFolders) {
	const ncommandFiles = fs
		.readdirSync(`./Ncommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of ncommandFiles) {
		const ncommand = require(`./Ncommands/${folder}/${file}`);
		client.commands.set(ncommand.name, ncommand);
	}
}

// ----------------------------------------------------------------------------------------------------------------------------------
// event listener

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// -----------------------------------------------------------------------------------------------------------------------------------
// interaction listener

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// ----------------------------------------------------------------------------------------------------------------------------------
// message command listener
client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Sorry mate, that won\'t work inside DMs.');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('Can\'t let you do this without perms.');
		}
	}


	if (command.args && !args.length) {
		let reply = `You're missing some mucho important imput for that to work, ${message.author}!`;

		if (command.usage) {
			reply += `\nYou'd need to do it like this: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}


	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`Chief, we've encountered an Error!\n${error}`);
	}
});
// ---------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
const cron = require('cron');
const Discord = require('discord.js');

const server = guildId;
const chat = generalc;

const title = '**__☆Daily Self-care Reminder☆__**';
const description = '**Make sure you drink enough water, eat well, spend at least 5min on self-care and take ya goddang meds!**';
const footer = '*＊✿❀*Love Yourself*❀✿＊*';
// --------------------------------------------------------------------------------------------------
// Embeds

// Monday
const membed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907638159574192128/image2.png')
	.setColor('RANDOM')
	.setFooter(footer);

// Tuesday
const tuembed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907638171511181362/image0.jpg')
	.setColor('RANDOM')
	.setFooter(footer);

// Wednesday
const wembed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/772471934231117834/912031656695697458/EHAuqFNX4AAUvIn.jpg')
	.setColor('RANDOM')
	.setFooter(footer);

// Thursday
const thembed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907638171804794900/image1.jpg')
	.setColor('RANDOM')
	.setFooter(footer);

// Friday
const fembed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907638172165488700/image2.jpg')
	.setColor('RANDOM')
	.setFooter(footer);

// Saturday
const saembed = new Discord.MessageEmbed()
	.setTitle(`**__☆Happy Selfish Saturday!☆__**`)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907639294833852486/image0.webp')
	.setColor('RANDOM')
	.setFooter(footer);

// Sunday
const suembed = new Discord.MessageEmbed()
	.setTitle(title)
	.setDescription(description)
	.setImage('https://cdn.discordapp.com/attachments/866432409998458891/907638159322546196/image1.jpg')
	.setColor('#BC84BC')
	.setFooter(footer);

// -------------------------------------------------------------------------------------------------
// Cron Jobs

// Monday
const monday = new cron.CronJob('00 00 15 * * 01', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [membed] });
});

// Tuesday
const tuesday = new cron.CronJob('00 00 15 * * 02', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [tuembed] });
});

// Wednesday
const wednesday = new cron.CronJob('00 00 15 * * 03', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [wembed] });
});

// Thursday
const thursday = new cron.CronJob('00 00 15 * * 04', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [thembed] });
});

// Friday
const friday = new cron.CronJob('00 00 15 * * 05', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [fembed] });
});

// Saturday
const saturday = new cron.CronJob('00 00 15 * * 06', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [saembed] });
});

// Sunday
const sunday = new cron.CronJob('00 00 15 * * 00', () => {
	const guild = client.guilds.cache.get(server);
	const general = guild.channels.cache.get(chat);
	general.send({ embeds: [suembed] });
});

// -------------------------------------------------------------------------------------------------
// Start Jobs
monday.start();
tuesday.start();
wednesday.start();
thursday.start();
friday.start();
saturday.start();
sunday.start();

// ----------------------------------------------------------------------------------------------------------------------------------

client.login(token);
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

// -----------------------------------------------------------------------------------------------------------------------------------
// command handler

// slash commands
client.commands = new Collection();

const commandFolders = fs.readdirSync('./Commands/Scommands');
for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./Commands/Scommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./Commands/Scommands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}
	const commandFiles2 = fs
		.readdirSync(`./Commands/Setup`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles2) {
		const command = require(`./Commands/Setup/${file}`);
		client.commands.set(command.data.name, command);
	}

	client.normalcommands = new Collection();
// normal commands
const ncommandFolders = fs.readdirSync('./Commands/Ncommands');
for (const folder of ncommandFolders) {
	const ncommandFiles = fs
		.readdirSync(`./Commands/Ncommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of ncommandFiles) {
		const ncommand = require(`./Commands/Ncommands/${folder}/${file}`);
		client.normalcommands.set(ncommand.name, ncommand);
	}
}

// ----------------------------------------------------------------------------------------------------------------------------------
// event listener

const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./Events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// -----------------------------------------------------------------------------------------------------------------------------------
// interaction listener
// commands

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// ----------------------------------------------------------------------------------------------------------------------------------
// message command listener
client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix)) return;

	// get command Name
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// look for command
	const ncommand = client.normalcommands.get(commandName)
		|| client.normalcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!ncommand) return;

	// check if guild only
	if (ncommand.guildOnly && message.channel.type === 'dm') {
		return message.reply('Sorry mate, that won\'t work inside DMs.');
	}

	// check permissions
	if (ncommand.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(ncommand.permissions)) {
			return message.reply('Can\'t let you do this without perms.');
		}
	}

	// check if all args are given
	if (ncommand.args && !args.length) {
		let reply = `You're missing some mucho important imput for that to work, ${message.author}!`;

		if (ncommand.usage) {
			reply += `\nYou'd need to do it like this: \`${prefix}${ncommand.name} ${ncommand.usage}\``;
		}

		return message.channel.send(reply);
	}

	// try execute
	try {
		ncommand.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`Chief, we've encountered an Error!\n${error}`);
	}
});
// ---------------------------------------------------------------------------------------------------------------------------------
// Cron Events
const { check } = require('./Events/checkpoint');
check.start();

// ----------------------------------------------------------------------------------------------------------------------------------

client.login(token);
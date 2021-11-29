const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, adminr, staffr, friendr, betar } = require('./config.json');
const fs = require('fs');

// Place your client and guild ids here
const clientId = '';
const guildId = '';

const commands = [];
const commandFolders = fs.readdirSync('./Scommands');
for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./Scommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./Scommands/${folder}/${file}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		const response = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');

		// admin
		const backupCommand = response.find(cmd => cmd.name === 'backup');
		const delticketCommand = response.find(cmd => cmd.name === 'delticket');
		const dmCommand = response.find(cmd => cmd.name === 'dm');

		// friend
		const pingCommand = response.find(cmd => cmd.name === 'ping');
		const whoisCommand = response.find(cmd => cmd.name === 'whois');
		const sayCommand = response.find(cmd => cmd.name === 'say');

		// staff
		const arrestCommand = response.find(cmd => cmd.name === 'arrest');
		const banCommand = response.find(cmd => cmd.name === 'ban');
		const kickCommand = response.find(cmd => cmd.name === 'kick');
		const muteCommand = response.find(cmd => cmd.name === 'mute');
		const unbanCommand = response.find(cmd => cmd.name === 'unban');
		const unmuteCommand = response.find(cmd => cmd.name === 'unmute');
		const closeCommand = response.find(cmd => cmd.name === 'close');
		const addroleCommand = response.find(cmd => cmd.name === 'addrole');
		const embedCommand = response.find(cmd => cmd.name === 'embed');
		const deleteCommand = response.find(cmd => cmd.name === 'delete');
		const qotdCommand = response.find(cmd => cmd.name === 'qotd');
		const removeroleCommand = response.find(cmd => cmd.name === 'removerole');

		const fullPermissions = [
			// admin
			{
				id: backupCommand.id,
				permissions: [
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: delticketCommand.id,
				permissions: [
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: dmCommand.id,
				permissions: [
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			// staff
			{
				id: arrestCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: banCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: kickCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: muteCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: unbanCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: unmuteCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: closeCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: addroleCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: embedCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
					{
						id: betar,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: deleteCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: qotdCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: removeroleCommand.id,
				permissions: [
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			// friend
			{
				id: pingCommand.id,
				permissions: [
					{
						id: friendr,
						type: 1,
						permission: true,
					},
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: whoisCommand.id,
				permissions: [
					{
						id: friendr,
						type: 1,
						permission: true,
					},
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
			{
				id: sayCommand.id,
				permissions: [
					{
						id: friendr,
						type: 1,
						permission: true,
					},
					{
						id: staffr,
						type: 1,
						permission: true,
					},
					{
						id: adminr,
						type: 1,
						permission: true,
					},
				],
			},
		];
		await rest.put(
			Routes.guildApplicationCommandsPermissions(clientId, guildId),
			{ body: fullPermissions },
		);
		console.log('Successfully applied permission overwrites.');
	}
	catch (error) {
		console.error(error);
	}
})();

// node deploy-commands.js to execute and register
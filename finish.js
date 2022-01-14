const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('./DatabaseModels/Setup')(sequelize, Sequelize);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFolders = fs.readdirSync('./Commands/Scommands');
for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./Commands/Scommands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./Commands/Scommands/${folder}/${file}`);
		commands.push(command.data.toJSON());
	}
}

module.exports = {
	async execute(interaction) {
		try {
			const server = await Setup.findOne({ where: {guild_id: interaction.guild.id } });
            if (!server) return interaction.editReply({ content: `Please do /setup error first`, ephemeral: true });

            if (server.admin_role === '0') return interaction.editReply({ content: 'Please make sure you set an administrator role, a staff role and a member role.', ephemeral: true });
            if (server.staff_role === '0') return interaction.editReply({ content: 'Please make sure you set an administrator role, a staff role and a member role.', ephemeral: true });
            if (server.member_role === '0') return interaction.editReply({ content: 'Please make sure you set an administrator role, a staff role and a member role.', ephemeral: true });
            const rest = new REST({ version: '9' }).setToken(server.token);

            console.log('/setting up commands')
            const response = await rest.put(
                Routes.applicationGuildCommands(server.client_id, server.guild_id),
                { body: commands },
            );
            console.log('/commands set, setting permissions next')

            // admin
		const backupCommand = response.find(cmd => cmd.name === 'backup');
		const delticketCommand = response.find(cmd => cmd.name === 'delticket');
		const dmCommand = response.find(cmd => cmd.name === 'dm');

		// friend
		const pingCommand = response.find(cmd => cmd.name === 'ping');
		const whoisCommand = response.find(cmd => cmd.name === 'whois');
		const sayCommand = response.find(cmd => cmd.name === 'say');
		const helpCommand = response.find(cmd => cmd.name === 'help');

		// staff
		const arrestCommand = response.find(cmd => cmd.name === 'arrest');
		const banCommand = response.find(cmd => cmd.name === 'ban');
		const kickCommand = response.find(cmd => cmd.name === 'kick');
		const warnCommand = response.find(cmd => cmd.name === 'warn');
		const muteCommand = response.find(cmd => cmd.name === 'mute');
		const unCommand = response.find(cmd => cmd.name === 'un');
		const ticketCommand = response.find(cmd => cmd.name === 'ticket');
		const roleCommand = response.find(cmd => cmd.name === 'role');
		const embedCommand = response.find(cmd => cmd.name === 'embed');
		const deleteCommand = response.find(cmd => cmd.name === 'delete');
		const qotdCommand = response.find(cmd => cmd.name === 'qotd');


         if (server.admin_role != '0' && server.staff_role != '0' && server.member_role != '0') {
            const fullPermissions = [

                // admin
                {
                    id: backupCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: delticketCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: dmCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
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
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: banCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: kickCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: warnCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: muteCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: unCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: ticketCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: roleCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: embedCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: deleteCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: qotdCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
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
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.member_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: helpCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.member_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: whoisCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.member_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
                {
                    id: sayCommand.id,
                    permissions: [
                        {
                            id: server.admin_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.staff_role,
                            type: 1,
                            permission: true,
                        },
                        {
                            id: server.member_role,
                            type: 1,
                            permission: true,
                        },
                    ],
                },
            ];
            await rest.put(
                Routes.guildApplicationCommandsPermissions(server.client_id, server.guild_id),
                { body: fullPermissions },
            );
            console.log('/permissions set');
        }
            
        return interaction.editReply({ content: 'Finished setup and registered commands', ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}
	},
};

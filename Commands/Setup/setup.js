const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('(OWNER) set up the bot')
		.addSubcommand(s => s.setName('help').setDescription('(OWNER) How to do the setup'))
		.addSubcommand(s => s.setName('error').setDescription('(OWNER) To ensure basic bot functions')
			.addChannelOption(o => o.setName('errorchannel').setDescription('The channel to send critical error messages to').setRequired(true)))
		.addSubcommand(s => s.setName('roles').setDescription('(OWNER) Set up all roles the bot needs')
			.addRoleOption(o => o.setName('admin').setDescription('The admin role'))
			.addRoleOption(o => o.setName('staff').setDescription('The staff role'))
			.addRoleOption(o => o.setName('member').setDescription('The member role'))
			.addRoleOption(o => o.setName('muted').setDescription('The muted role'))
			.addRoleOption(o => o.setName('jail').setDescription('The jail role'))
			.addStringOption(o => o.setName('everyone').setDescription('The everyone role id'))
			.addRoleOption(o => o.setName('chatreviver').setDescription('The chatreviver role')),
		)
		.addSubcommand(s => s.setName('channels').setDescription('(OWNER) Set up all the channels the bot needs')
			.addChannelOption(o => o.setName('modlog').setDescription('The modlog channel'))
			.addChannelOption(o => o.setName('logs').setDescription('The logs channel'))
			.addChannelOption(o => o.setName('tickets').setDescription('The tickets channel'))
			.addChannelOption(o => o.setName('publicmodlog').setDescription('The public modlog channel'))
			.addChannelOption(o => o.setName('jail').setDescription('The jail channel'))
			.addChannelOption(o => o.setName('general').setDescription('The general chat')),
		)
		.addSubcommand(s => s.setName('other').setDescription('(OWNER) Prefix, Co-Owner, etc')
			.addStringOption(o => o.setName('prefix').setDescription('The prefix, if none set it will be "lsb"'))
			.addUserOption(o => o.setName('co-owner').setDescription('Add one Co-Owner'))
			.addChannelOption(o => o.setName('opentickets').setDescription('Open tickets category'))
			.addChannelOption(o => o.setName('closedtickets').setDescription('Closed tickets category'))
			.addStringOption(o => o.setName('ticketname').setDescription('If tickets should include the username: username, if just number: number'))
			.addStringOption(o => o.setName('backup').setDescription('last part of the template link (eg. https://discord.new/A4h8PfdE7IE)')),
		)
		.addSubcommand(s => s.setName('finish').setDescription('(OWNER) Finish setting up the server'))
		.addSubcommand(s => s.setName('settings').setDescription('(OWNER) Overview of the server settings')),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `loading...`, ephemeral: true });
			const guild = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!guild) {
				if (interaction.guild.ownerId != interaction.user.id) return;
			}
			if (guild) {
				if (guild.co_owner != '0') {
					if (interaction.guild.ownerId != interaction.user.id || guild.co_owner != interaction.user.id) return;
				}
				if (guild.co_owner === '0') {
					if (interaction.guild.ownerId != interaction.user.id) return;
				}
			}

			if (interaction.options.getSubcommand() === 'help') {
				const help = require('./setup/help');
				return help.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'error') {
				const error = require('./setup/error');
				return error.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'roles') {
				const roles = require('./setup/roles');
				return roles.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'channels') {
				const channels = require('./setup/channels');
				return channels.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'other') {
				const other = require('./setup/other');
				return other.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'finish') {
				const finish = require('../../finish');
				return finish.execute(interaction);
			}
			if (interaction.options.getSubcommand() === 'settings') {
				const settings = require('./setup/settings');
				return settings.execute(interaction);
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};

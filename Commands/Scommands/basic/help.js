const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List of all commands')
		.setDefaultPermission(false)
		.addSubcommandGroup(group =>
			group
				.setName('main')
				.setDescription('main')
				.addSubcommand(subcommand =>
					subcommand
						.setName('list')
						.setDescription('A list of all commands'),
				),
		)

		.addSubcommandGroup(group =>
			group
				.setName('basic')
				.setDescription('all basic commands')
				.addSubcommand(subcommand =>
					subcommand
						.setName('ping')
						.setDescription('Help on the ping command'),
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('say')
						.setDescription('Help on the say command'),
				)
				.addSubcommand(subcommand =>
					subcommand
						.setName('whois')
						.setDescription('Help on the whois command'),
				),
		),
	async execute(interaction) {
		try {
			if (interaction.options.getSubcommandGroup() === 'main') {
				if (interaction.options.getSubcommand() === 'list') {
					await interaction.reply({ content: `Making list...`, ephemeral: true });
					const list = require('./Help/main');

					return list.execute(interaction);
				}
			}
			if (interaction.options.getSubcommandGroup() === 'basic') {
				if (interaction.options.getSubcommand() === 'ping') {
					const ping = require('./Help/ping');
					ping.execute(interaction);
				}
				if (interaction.options.getSubcommand() === 'say') {
					const say = require('./Help/say');
					say.execute(interaction);
				}
				if (interaction.options.getSubcommand() === 'whois') {
					const whois = require('./Help/whois');
					whois.execute(interaction);
				}
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.FollowUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
		}

	},
};
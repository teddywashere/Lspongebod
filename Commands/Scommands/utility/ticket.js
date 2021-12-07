const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('(STAFF)')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('rename')
				.setDescription('(STAFF) Rename a ticket')
				.addChannelOption(option => option.setName('ticket').setDescription('The ticket to rename').setRequired(true))
				.addStringOption(option => option.setName('name').setDescription('The new name for the ticket. No #, etc.').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('close')
				.setDescription('(STAFF) Close a ticket')
				.addChannelOption(option => option.setName('ticket').setDescription('The ticket channel to close').setRequired(true))
				.addStringOption(option => option.setName('reason').setDescription('Reason for closing the ticket').setRequired(true))
				.addUserOption(option => option.setName('member').setDescription('The member who opened the ticket').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('adduser')
				.setDescription('(STAFF) Add a member to a ticket')
				.addUserOption(option => option.setName('member').setDescription('The member to add').setRequired(true))
				.addChannelOption(option => option.setName('ticket').setDescription('The ticket the member should be added to').setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('removeuser')
				.setDescription('(STAFF) Remove a member from a ticket')
				.addUserOption(option => option.setName('member').setDescription('The member to remove').setRequired(true))
				.addChannelOption(option => option.setName('ticket').setDescription('The ticket the member should be removed from').setRequired(true)),
		),

	async execute(interaction) {
		try {
			// RENAME TICKET
			if (interaction.options.getSubcommand() === 'rename') {
				await interaction.reply({ content: 'Renaming...', ephemeral: true });

				const renaming = require('./Ticket/TicketRename');

				if (!renaming) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry.`, ephemeral: true });
				if (renaming) return renaming.execute(interaction);
			}

			// CLOSE TICKET
			if (interaction.options.getSubcommand() === 'close') {
				await interaction.reply({ content: 'Closing...', ephemeral: true });

				const closing = require('./Ticket/TicketClose');

				if (!closing) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (closing) return closing.execute(interaction);
			}

			// ADD USER TO TICKET
			if (interaction.options.getSubcommand() === 'adduser') {
				await interaction.reply({ content: 'Adding...', ephemeral: true });

				const adding = require('./Ticket/TicketAddUser');

				if (!adding) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (adding) return adding.execute(interaction);
			}

			// REMOVE USER FROM TICKET
			if (interaction.options.getSubcommand() === 'removeuser') {
				await interaction.reply({ content: 'Removing...', ephemeral: true });

				const removing = require('./Ticket/TicketRemoveUser');

				if (!removing) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (removing) return removing.execute(interaction);
			}

		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
		}
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Make and send a new embed')
		.setDefaultPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName('basic').setDescription('(STAFF) Only title, text and color')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('footer').setDescription('(STAFF) Title, text, color and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('thumbnail').setDescription('(STAFF) Title, text, color and thumbnail')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('thumbnail').setDescription('A (not too long) image link').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('all').setDescription('(STAFF) Title, text, color, thumbnail and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('thumbnail').setDescription('A (not too long) image link').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('image1').setDescription('(STAFF) Title, text, color and image')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('image').setDescription('The main image link for the embed').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('image2').setDescription('(STAFF) Title, text, color, image and footer')
				.addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
				.addStringOption(option => option.setName('description').setDescription('The main text of you embed').setRequired(true))
				.addStringOption(option => option.setName('color').setDescription('Either a hex color like #000000, "RANDOM", or check the embed colors command').setRequired(true))
				.addStringOption(option => option.setName('image').setDescription('The main image link for the embed').setRequired(true))
				.addStringOption(option => option.setName('footer').setDescription('Set the footer').setRequired(true))
				.addChannelOption(option => option.setName('channel').setDescription('A channel to send it too')),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('colors').setDescription('(STAFF) A list of all possible color names'),
		),

	async execute(interaction) {
		try {
			// EMBED BASIC
			if (interaction.options.getSubcommand() === 'basic') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const basic = require('./Embed/EmbedBasic');

				if (!basic) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (basic) return basic.execute(interaction);
			}

			// EMBED FOOTER
			if (interaction.options.getSubcommand() === 'footer') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const footer = require('./Embed/EmbedFooter');

				if (!footer) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (footer) return footer.execute(interaction);

			}

			// EMBED THUMBNAIL
			if (interaction.options.getSubcommand() === 'thumbnail') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const thumbnail = require('./Embed/EmbedThumbnail');

				if (!thumbnail) return interaction.editReply({ content: `Couldn't find that executable... Sorry!`, ephemeral: true });
				if (thumbnail) return thumbnail.execute(interaction);
			}

			// EMBED ALL
			if (interaction.options.getSubcommand() === 'all') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const all = require('./Embed/EmbedAll');

				if (!all) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (all) return all.execute(interaction);

			}

			// EMBED IMAGE1
			if (interaction.options.getSubcommand() === 'image1') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const imageone = require('./Embed/EmbedImageOne');

				if (!imageone) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (imageone) return imageone.execute(interaction);
			}

			// EMBED IMAGE2
			if (interaction.options.getSubcommand() === 'image2') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const imagetwo = require('./Embed/EmbedImageTwo');

				if (!imagetwo) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sorry`, ephemeral: true });
				if (imagetwo) return imagetwo.execute(interaction);
			}

			// EMBED COLORS
			if (interaction.options.getSubcommand() === 'colors') {
				await interaction.reply({ content: `Making embed...`, ephemeral: true });

				const coloring = require('./Embed/EmbedColors');

				if (!coloring) return interaction.editReply({ content: `Couldn't find the executable for that... I'm sotty`, ephemeral: true });
				if (coloring) return coloring.execute(interaction);
			}
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}

	},
};
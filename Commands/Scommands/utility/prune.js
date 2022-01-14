const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('(STAFF) Purge up to 99 messages.')
		.setDefaultPermission(false)
		.addIntegerOption(option => option.setName('amount').setDescription('Number of messages to prune').setRequired(true)),
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('MANAGE_MESSAGES')) return interaction.editReply({ content: `You don't have the manage messages permission.`, ephemeral: true });

			await interaction.reply({ content: `Deleting...`, ephemeral: true });
			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const amount = await interaction.options.getInteger('amount');
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);
			if (amount <= 1 || amount > 100) return interaction.editReply({ content: 'You can only delete at least 1 and at most 99 messages.', ephemeral: true });

			await interaction.channel.bulkDelete(amount, true);

			const pruneEmbed = new Discord.MessageEmbed()
				.setTitle(`:wastebasket:**${amount} Messages deleted**:wastebasket:`)
				.setDescription(`_ _\n**Deleted in:** ${interaction.channel}\n\n**Deleted by:** ${interaction.user}\n\n**ID:** \`${interaction.user.id}\``)
				.setColor('#4374f9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567684846645248/prune.jpg')
				.setTimestamp();

			if(logs) logs.send({ embeds: [pruneEmbed] }).catch(O_o => {});

			return interaction.editReply({ content: `Successfully deleted ${amount} messages`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			return interaction.followUp({ content: `\`Please screenshot and report me to Rainbow\`\n**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true }).catch(oopsie => {});
		}
	},
};
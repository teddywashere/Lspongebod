const Discord = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../../DatabaseModels/Setup')(sequelize, Sequelize);
const Ticket = require('../../../../DatabaseModels/Tickets')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please to /setup error first` });

			const member = await interaction.options.getUser('member');
			const ticket = await interaction.options.getChannel('ticket');
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);
			if (!Ticket.findOne({ where: { channel_id: ticket.id, guild_id: interaction.guild.id } })) return interaction.editReply({ content: `Are you sure the channel you tagged is a ticket?`, ephemeral: true });

			ticket.permissionOverwrites.delete(member.id, {
				VIEW_CHANNEL: false,
			});

			const logsembed = new Discord.MessageEmbed()
				.setTitle(`:nesting_dolls:**Member removed from Ticket**:nesting_dolls:`)
				.setDescription(`_ _\n**Member:** ${member}\n**Tag:** ${member.username}\n**ID:** \`${member.id}\`\n\n**Ticket:** ${ticket}\n${ticket.name}\n\n**Removed by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n_ _`)
				.setColor('#5dc9a9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/917101187617157170/38.png')
				.setTimestamp();

			if(logs) logs.send({ embeds: [logsembed] }).catch(O_o => {});

			return interaction.editReply({ content: `${member} removed from ${ticket}`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

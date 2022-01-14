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

			const server = await Setup.findOne({ where: {guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const ticket = await interaction.options.getChannel('ticket');
			const oldname = await ticket.name;
			const newname = await interaction.options.getString('name');
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);
			if (!Ticket.findOne({ where: { channel_id: ticket.id, guild_id: interaction.guild.id } })) return interaction.editReply({ content: 'Please make sure the channel you want to rename is a ticket.', ephemeral: true });

			await ticket.setName(newname);

			const renamembed = new Discord.MessageEmbed()
				.setTitle(`:pencil:**Ticket Renamed** :pencil:`)
				.setDescription(`_ _\n**Ticket:** ${ticket}\n\n**Old** **Name:** ${oldname}\n\n**New** **Name:** ${newname}\n\n**Renamed** **by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n_ _`)
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/915190372152528936/DoodleBob.Pencil.jpg')
				.setColor('#64b4ff')
				.setTimestamp();

			if(logs) logs.send({ embeds: [renamembed] }).catch(O_o => {});
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

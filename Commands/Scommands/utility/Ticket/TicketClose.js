/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
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
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const channel = await interaction.options.getChannel('ticket');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.options.getUser('member');
			const category = await interaction.guild.channels.cache.get(server.ticketclose_channel);
			const logs = await interaction.guild.channels.cache.get(server.logs_channel);
			const ticket = await Ticket.findOne({ where: { channel_id: channel.id, guild_id: interaction.guild.id } });
			if (!ticket) return interaction.editReply({ content: `Are you sure the channel you want to close is a ticket?`, ephemeral: true });
			if (ticket.status === 'closed') return interaction.editReply({ content: `${channel} is already closed`, ephemeral: true });
			const thetick = await interaction.guild.channels.cache.get(ticket.channel_id);

			if (!category) {
				const oldname1 = await thetick.name;
				await thetick.setName(`(CLOSED)${oldname1}`);
			}
			if (category) {
				await thetick.setParent(category);
				const oldname2 = await thetick.name;
				await thetick.setName(`(CLOSED)${oldname2}`);
			}

			const dmembed = new Discord.MessageEmbed()
				.setTitle(`Your ticket in ${interaction.guild} has been closed`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#572eff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
				.setTimestamp();

			const nomemclosedembed = new Discord.MessageEmbed()
				.setTitle(`:file_cabinet:**Ticket Closed**:file_cabinet:`)
				.setDescription(`_ _\n**Ticket:** ${thetick}\n\n**Ticket name:**${thetick.name}\n\n**Closed by:** ${author}\n\n**Tag:** ${author.tag}\n\n**ID:** \`${author.id}\`\n\n**Opened by:** ???\n\n**Tag:** ???\n\n**ID:** \`???\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#572eff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
				.setTimestamp();

			if (member) await member.send({ embeds: [dmembed] }).catch(O_o => {});
			if (logs) {
				if (member) {

					const memclosedembed = new Discord.MessageEmbed()
						.setTitle(`:file_cabinet:**Ticket Closed**:file_cabinet:`)
						.setDescription(`_ _\n**Ticket:** ${thetick}\n\n**Ticket name:**${thetick.name}\n\n**Closed by:** ${author}\n\n**Tag:** ${author.tag}\n\n**ID:** \`${author.id}\`\n\n**Opened by:** ${member}\n\n**Tag:** ${member.tag}\n\n**ID:** \`${member.id}\`\n\n**Reason:** ${reason}\n_ _`)
						.setColor('#572eff')
						.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/912725753131593758/Screenshot_20211123-162443_1.png')
						.setTimestamp();
					logs.send({ embeds: [memclosedembed] }).catch(O_o => {});
				}
				if (!member) {
					logs.send({ embeds: [nomemclosedembed]}).catch(O_o => {});
				}
			} 
			await ticket.update({ where: { status: 'closed' } });

			return interaction.editReply({ content: `Ticket closed`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

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
	async execute(interaction) {
		try {
            const server = await Setup.findOne({ where: { guild_id: interaction.guild.id }});
            if (!server) return interaction.reply({ content: `Please do /setup error first`, ephemeral: true });

            const owner = await interaction.guild.members.cache.get(server.owner_id);
            const coowner = await interaction.guild.members.cache.get(server.co_owner);
            const adminrole = await interaction.guild.roles.cache.get(server.admin_role);
            const staffrole = await interaction.guild.roles.cache.get(server.staff_role);
            const memberrole = await interaction.guild.roles.cache.get(server.member_role);
            const everyonerole = await interaction.guild.roles.cache.get(server.everyone_role);

            const jailrole = await interaction.guild.roles.cache.get(server.jail_role);
            const jailchannel = await interaction.guild.channels.cache.get(server.jail_channel);
            const muterole = await interaction.guild.roles.cache.get(server.mute_role);
            const chatrevive = await interaction.guild.roles.cache.get(server.chatreviver_role);
            
            const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
            const logs = await interaction.guild.channels.cache.get(server.logs_channel);
            const general = await interaction.guild.channels.cache.get(server.general_chat);
            const criminals = await interaction.guild.channels.cache.get(server.criminals_channel);

            const ticketschannel = await interaction.guild.channels.cache.get(server.ticket_channel);
            const ticketname = server.ticket_name;
            const opentickets = await interaction.guild.channels.cache.get(server.ticketopen_channel);
            const closedtickets = await interaction.guild.channels.cache.get(server.ticketclose_channel);

            const errorchannel = await interaction.guild.channels.cache.get(server.error_channel);
            const prefix = server.prefix;
            const template = server.template;
        
			const embed = new Discord.MessageEmbed()
				.setTitle(`Server Settings`)
				.setDescription(`_ _\n**Owner:** ${owner}\n**Co-Owner:** ${coowner}\n**Admin role:** ${adminrole}\n**Staff role:** ${staffrole}\n**Member role:** ${memberrole}\n**Everyone role:** ${everyonerole}\n\n**Chatreviver role:** ${chatrevive}\n**Mute role:** ${muterole}\n**Jail role:** ${jailrole}\n**Jail channel:** ${jailchannel}\n\n**General chat:** ${general}\n**Modlog:** ${modlog}\n**Logs:** ${logs}\n**Public Modlog:** ${criminals}\n\n**Tickets channel:** ${ticketschannel}\n**Open tickets category:** ${opentickets}\n**Closed tickets category:** ${closedtickets}\n**Ticket name system:** ${ticketname}\n\n**Error channel:** ${errorchannel}\n**Prefix:** \`${prefix}\`\n**Backup Template:** \`https://discord.new/${template}\`\n_ _`)
				.setColor('#388ef9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/930425013482426368/Adobe_20220111_123620.jpg')
				.setFooter(`bot owner: RainbowAlliance#7498`)
			
			return interaction.editReply( {content: `For further questions, bugreports and suggestions dm Rainbow.`, embeds: [embed], ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
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
const Mute = require('../../../../DatabaseModels/jailmute')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			if (!author.permissions.has('KICK_MEMBERS')) return interaction.editReply({ content: `You don't have the kick members permission.`, ephemeral: true });

			const server = await Setup.findOne({ where: { guild_id: interaction.guild.id } });
			if (!server) return interaction.editReply({ content: `Please do /setup error first` });

			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.guild.members.cache.get(target.id);

			const modlog = await interaction.guild.channels.cache.get(server.modlog_channel);
			const muterole = await interaction.guild.roles.cache.get(server.mute_role);

			if (!muterole) return interaction.editReply({ content: 'Mute role not found. Make sure its set up properly', ephemeral: true });
			if (!member.roles.cache.has(server.mute_role)) return interaction.editReply({ content: `${target} is not muted.`, ephemeral: true });
			if (target.id === interaction.user.id) return interaction.editReply({ content: `You can't unmute yourself, dummy!`, ephemeral: true });

			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You've been unmuted in ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#009fff')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await member.roles.remove(muterole);
			await target.send({ embeds: [dmembed] }).catch((O_o) => {});

			const unmuteembed = new Discord.MessageEmbed()
				.setTitle(`:grinning:**Member Unmuted**:grinning:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**Tag:** ${target.tag}\n\n**ID:** \`${target.id}\`\n\n**Unmuted by:** ${interaction.user}\n\n**Tag:** ${interaction.user.tag}\n\n**ID:** \`${interaction.user.id}\`\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#009fff')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			if(modlog) modlog.send({ embeds: [unmuteembed] }).catch(O_o => {});

			const jailmute = await Mute.findOne({ where: { user_id: target.id, guild_id: interaction.guild.id }});
			if (jailmute) await jailmute.update({mute_status: 'false'});
			return interaction.editReply({ content: `${target} has been unmuted`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

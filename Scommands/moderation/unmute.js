const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { modlogc, muter, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('(STAFF) Unmutes a muted member')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('target').setDescription('Member to unmute').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for unmute').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Unmuting...`, ephemeral: true });

			const target = await interaction.options.getUser('target');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.guild.members.cache.get(target.id);

			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const muterole = await interaction.guild.roles.cache.get(muter);

			const me = await interaction.guild.members.cache.get(owner);
			if (!modlog) await me.send(`${interaction.user} tried to use unmute command in ${interaction.guild}\n**ERROR:**\nModlog not found`).catch(O_o => console.log(O_o));

			if (!muterole) return interaction.editReply({ content: 'Muted role not found.', ephemeral: true });
			if (!member.roles.cache.has(muter)) return interaction.editReply({ content: `${target} is not muted.`, ephemeral: true });
			if (target.id === interaction.user.id) return interaction.editReply({ content: `You can't unmute yourself, dummy!`, ephemeral: true });

			// unmute target
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You've been unmuted in ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#009fff')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await member.roles.remove(muterole);
			await target.send({ embeds: [dmembed] }).catch((O_o) => {console.log(O_o); });

			// send modlog, criminals and interaction reply
			const unmuteembed = new Discord.MessageEmbed()
				.setTitle(`:grinning:**Member Unmuted**:grinning:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${target.id}\`\n\n**Unmuted by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#009fff')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			await modlog.send({ embeds: [unmuteembed] }).catch(O_o => me.send(`${interaction.user} tried to use unmute command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `${target} has been unmuted`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
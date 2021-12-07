const Discord = require('discord.js');

const { modlogc, muter, errorc } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.guild.members.cache.get(target.id);

			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const muterole = await interaction.guild.roles.cache.get(muter);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first');
			if (!modlog) await error.send(`${interaction.user} tried to use unmute command in ${interaction.guild}\n**ERROR:**\nModlog not found`);

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

			await modlog.send({ embeds: [unmuteembed] }).catch(O_o => error.send(`${interaction.user} tried to use unmute command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `${target} has been unmuted`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

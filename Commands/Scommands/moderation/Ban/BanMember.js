const Discord = require('discord.js');
const { modlogc, criminalsc, errorc, clientId } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);

			// error checks
			const error = await interaction.guild.members.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first');
			if (!modlog || !criminals) await error.send(`${interaction.user} tried to use ban command in ${interaction.guild}\n**ERROR:**\n Either modlog or criminals not found.`);

			const target = await interaction.options.getUser('member');
			const reason = await interaction.options.getString('reason');
			const member = await interaction.guild.members.cache.get(target.id);

			if (interaction.user.id === target.id) return interaction.editReply({ content: "You can't ban yourself, dummy!", ephemeral: true });
			if (target.id === clientId) return interaction.editReply({ content: "Sorry mate but I can't ban myself.", ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });

			// ban target
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You were banned from ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await target.send({ embeds: [dmembed] }).catch((O_o) => {console.error(O_o); });
			const rip = target.id;
			await member.ban({ days: 7, reason: reason });

			// modlog
			const targetembed = new Discord.MessageEmbed()
				.setTitle(`:name_badge:**Member Banned**:name_badge:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${rip}\`\n\n**Banned by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			await modlog.send({ embeds: [targetembed] }).catch(O_o => error.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			// criminals
			const ripcrime = new Discord.MessageEmbed()
				.setTitle(`**\`${rip}\` has been banned** `)
				.setDescription(`**Reason:** ${reason}\n_ _`)
				.setColor('#ff0052')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911567635844595722/banhammer.jpg')
				.setTimestamp();

			await criminals.send({ embeds: [ripcrime] }).catch(O_o => error.send(`${interaction.user} tried to user ban command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			// reply
			return interaction.editReply({ content: `\`${rip}\` has been banned`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const { logsc, staffr, errorc } = require('../../../../config.json');

module.exports = {
	async execute(interaction) {
		try {
			const role = await interaction.options.getRole('role');
			const target = await interaction.options.getUser('target');
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const logs = await interaction.guild.channels.cache.get(logsc);
			const staff = await interaction.guild.roles.cache.get(staffr);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!logs) await error.send(`Logs channel not found`);
			if (role.comparePositionTo(staff) > 0) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });

			// add role to member
			if (target) {
				const member = await interaction.guild.members.cache.get(target.id);
				if (member.roles.cache.has(role.id)) return interaction.editReply({ content: `Member already has that role`, ephemeral: true });

				await member.roles.add(role);

				const targetembed = new Discord.MessageEmbed()
					.setTitle(':inbox_tray:**Role Added**:inbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${target}\n\n**Added by:** ${interaction.user}\n_ _`)
					.setThumbnail(target.displayAvatarURL())
					.setColor('#00ffac')
					.setTimestamp();

				await logs.send({ embeds: [targetembed] }).catch(O_o => error.send(`${O_o}`));

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role added in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} gave you a role\n_ _`)
					.setColor('#00ffac')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {});
				return interaction.editReply({ content: `Added ${role} to ${target}`, ephemeral: true });
			}

			// add role to author
			if (!target) {
				if (author.roles.cache.has(role.id)) return interaction.editReply({ content: `You already have that role`, ephemeral: true });

				await author.roles.add(role);

				const authorembed = new Discord.MessageEmbed()
					.setTitle(':inbox_tray:**Role Added**:inbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${interaction.user}\n\n**Added by:** ${interaction.user}\n_ _`)
					.setThumbnail(author.displayAvatarURL())
					.setColor('#00ffac')
					.setTimestamp();

				await logs.send({ embeds: [authorembed] }).catch(O_o => error.send(`${O_o}`));
				return interaction.editReply({ content: `Gave you the ${role} role.`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

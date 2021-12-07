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
			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!logs) await error.send(`Logs not found`);
			if (role.comparePositionTo(staff) > 0) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });

			// TARGET
			if (target) {
				const member = await interaction.guild.members.cache.get(target.id);
				if (!member.roles.cache.has(role.id)) return interaction.editReply({ content: `Member doesn't have that role`, ephemeral: true });

				await member.roles.remove(role);

				const targetembed = new Discord.MessageEmbed()
					.setTitle(':outbox_tray:**Role Removed**:outbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${target}\n\n**Removed by:** ${interaction.user}`)
					.setThumbnail(target.displayAvatarURL())
					.setColor('#f84084')
					.setTimestamp();

				await logs.send({ embeds: [targetembed] }).catch(O_o => error.send(`${O_o}`));

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role removed in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} removed a role from you\n_ _`)
					.setColor('#f84084')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {});
				return interaction.editReply({ content: `Removed ${role} from ${target}`, ephemeral: true });
			}
			if (!target) {
				if (!author.roles.cache.has(role.id)) return interaction.editReply({ content: `You don't have that role`, ephemeral: true });

				await author.roles.remove(role);

				const authorembed = new Discord.MessageEmbed()
					.setTitle(':outbox_tray:**Role Removed**:outbox_tray:')
					.setDescription(`_ _\n**Role:** ${role}\n\n**Member:** ${interaction.user}\n\n**Removed by:** ${interaction.user}`)
					.setThumbnail(author.displayAvatarURL())
					.setColor('#f84084')
					.setTimestamp();

				await logs.send({ embeds: [authorembed] }).catch(O_o => error.send(`${O_o}`));
				return interaction.editReply({ content: `Removed the ${role} role from you.`, ephemeral: true });
			}
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};

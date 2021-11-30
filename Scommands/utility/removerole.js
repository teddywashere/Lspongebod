const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { logsc, staffr, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('(STAFF) Remove a role from yourself or a user,no target if you want to remove it from youself')
		.setDefaultPermission(false)
		.addRoleOption(options => options.setName('role').setDescription('The role to remove').setRequired(true))
		.addUserOption(options => options.setName('target').setDescription('The user to remove the role from')),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Removing role...`, ephemeral: true });

			const role = await interaction.options.getRole('role');
			const target = await interaction.options.getUser('target');
			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const logs = await interaction.guild.channels.cache.get(logsc);
			const staff = await interaction.guild.roles.cache.get(staffr);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send(`${interaction.user} tried to use removerole command in ${interaction.guild}\n**ERROR:**\nLogs not found`).catch(O_o => console.log(O_o));
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

				await logs.send({ embeds: [targetembed] }).catch(O_o => me.send(`${interaction.user} tried to use removerole command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role removed in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} removed a role from you\n_ _`)
					.setColor('#f84084')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {console.log(O_o); });
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

				await logs.send({ embeds: [authorembed] }).catch(O_o => me.send(`${interaction.user} tried to use removerole command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
				return interaction.editReply({ content: `Removed the ${role} role from you.`, ephemeral: true });
			}

		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { logsc, staffr, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDefaultPermission(false)
		.setDescription('(STAFF) Add a role to yourself or a user, no target if you want to add it to yourself')
		.addRoleOption(options => options.setName('role').setDescription('The role to add').setRequired(true))
		.addUserOption(options => options.setName('target').setDescription('The user to add the role to')),
	async execute(interaction) {
		try {
			interaction.reply({ content: `Adding role...`, ephemeral: true });

			const role = await interaction.options.getRole('role');
			const target = await interaction.options.getUser('target');
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const logs = await interaction.guild.channels.cache.get(logsc);
			const staff = await interaction.guild.roles.cache.get(staffr);

			const me = await interaction.guild.members.cache.get(owner);
			if (!logs) await me.send(`${interaction.user} tried to use addrole command in ${interaction.guild}\n**ERROR:**\nLogs channel not found`).catch(O_o => console.log(O_o));
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

				await logs.send({ embeds: [targetembed] }).catch(O_o => me.send(`${interaction.user} tried to use addrole command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

				const dmembed = new Discord.MessageEmbed()
					.setTitle(`Role added in ${interaction.guild}`)
					.setDescription(`_ _\n${interaction.user} gave you a role\n_ _`)
					.setColor('#00ffac')
					.setThumbnail(interaction.guild.iconURL())
					.setTimestamp();

				await target.send({ embeds: [dmembed] }).catch((O_o) => {console.log(O_o); });
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

				await logs.send({ embeds: [authorembed] }).catch(O_o => me.send(`${interaction.user} tried to use addrole command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
				return interaction.editReply({ content: `Gave you the ${role} role.`, ephemeral: true });
			}

		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
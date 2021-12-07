/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { modlogc, criminalsc, errorc, clientId } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('(STAFF) Kick a member.')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason for being kicked').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Kicking...`, ephemeral: true });

			const target = await interaction.options.getUser('target');
			const reason = await interaction.options.getString('reason');

			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);

			const author = await interaction.guild.members.cache.get(interaction.user.id);
			const member = await interaction.guild.members.cache.get(target.id);

			const error = await interaction.guild.channels.cache.get(errorc);
			if (!error) return interaction.channel.send('Please do the setup first!');
			if (!modlog || !criminals) await error.send(`Either modlog or criminals not found, please do the setup first!`);

			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });
			if (interaction.user.id === target.id) return interaction.editReply({ content: "You can't kick yourself, dummy!", ephemeral: true });
			if (target.id === clientId) return interaction.editReply({ content: "Sorry mate but I can't kick myself.", ephemeral: true });

			// kick offender
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You were kicked from ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#ff6800')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			const rip = target.id;
			await target.send({ embeds: [dmembed] }).catch((O_o) => {});
			await interaction.guild.members.kick(rip);

			// send modlog
			const kickembed = new Discord.MessageEmbed()
				.setTitle(':anger:**Member Kicked**:anger:')
				.setColor('#ff6800')
				.setThumbnail(target.displayAvatarURL())
				.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${target.id}\` \n \n**Kicked by:** ${interaction.user} \n \n**Reason:** ${reason}\n_ _`)
				.setTimestamp();

			await modlog.send({ embeds: [kickembed] }).catch(O_o => error.send(`${O_o}`));

			// send Criminals
			const ripembed = new Discord.MessageEmbed()
				.setTitle(`**\`${rip}\` has been kicked**`)
				.setDescription(`**Reason:** ${reason}\n_ _`)
				.setColor('#ff6800')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911659304443072612/c2823fe7a42bd0d578302c185bc241d0b32a4877a36008c36f2dbe47606ae717.jpg')
				.setTimestamp();

			await criminals.send({ embeds: [ripembed] }).catch(O_o => error.send(`${O_o}`));

			// reply
			return interaction.editReply({ content: `${target.username} has been kicked.`, ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${O_o}!`, ephemeral: true });
		}

	},
};
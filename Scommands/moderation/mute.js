const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { modlogc, criminalsc, muter, owner, clientId } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('(STAFF) Mutes a member')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('target').setDescription('Member to mute').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for mute').setRequired(true)),
	async execute(interaction) {
		try {
			interaction.reply({ content: `Muting...`, ephemeral: true });

			const target = await interaction.options.getUser('target');
			const reason = await interaction.options.getString('reason');

			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);
			const muterole = await interaction.guild.roles.cache.get(muter);

			const member = await interaction.guild.members.cache.get(target.id);
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const me = await interaction.guild.members.cache.get(owner);
			if (!modlog || !criminals) await me.send(`${interaction.user} tried to use mute command in ${interaction.guild}\n**ERROR:**\n Either modlog or criminals not found`).catch(O_o => console.log(O_o));

			if (!muterole) return interaction.editReply({ content: 'Muted role not found.', ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I'm not gonna let you do that.`, ephemeral: true });
			if (member.roles.cache.has(muter)) return interaction.editReply({ content: `${target} is already muted.`, ephemeral: true });
			if (target.id === interaction.user.id) return interaction.editReply({ content: `You can't mute yourself, dummy!`, ephemeral: true });
			if (target.id === clientId) return interaction.editReply({ content: `I can't mute myself...`, ephemeral: true });

			// mute target
			await member.roles.add(muterole);

			// send modlog, criminals and interaction reply
			const muteembed = new Discord.MessageEmbed()
				.setTitle(`:zipper_mouth:**Member Muted**:zipper_mouth:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${target.id}\`\n\n**Muted by:** ${interaction.user}\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You've been muted in ${interaction.guild}`)
				.setDescription(`_ _\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			const crimeembed = new Discord.MessageEmbed()
				.setTitle(`**Member Muted**`)
				.setDescription(`${target} got muted.\n\n**Reason:** ${reason}\n_ _`)
				.setColor('#b600ff')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911660900677718016/3ipz0r.jpg')
				.setTimestamp();

			await modlog.send({ embeds: [muteembed] }).catch(O_o => me.send(`${interaction.user} tried to use mute command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
			await criminals.send({ embeds: [crimeembed] }).catch(O_o => me.send(`${interaction.user} tried to use mute command in ${interaction.guild}\n**ERROR:**\n${O_o}`));
			await target.send({ embeds: [dmembed] }).catch((O_o) => {console.log(O_o); });

			return interaction.editReply({ content: `${target} has been muted`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
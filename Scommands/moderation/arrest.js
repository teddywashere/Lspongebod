const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const { modlogc, criminalsc, jailc, jailr, friendr, owner } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arrest')
		.setDescription('(STAFF) Send em to jail!')
		.setDefaultPermission(false)
		.addUserOption(option => option.setName('target').setDescription('The member to arrest').setRequired(true)),
	async execute(interaction) {
		try {
			await interaction.reply({ content: `Arresting...`, ephemeral: true });

			const target = await interaction.options.getUser('target');
			const member = await interaction.guild.members.cache.get(target.id);
			const author = await interaction.guild.members.cache.get(interaction.user.id);

			const modlog = await interaction.guild.channels.cache.get(modlogc);
			const criminals = await interaction.guild.channels.cache.get(criminalsc);
			const jail = await interaction.guild.channels.cache.get(jailc);

			// error checks
			const me = await interaction.guild.members.cache.get(owner);
			if (!friendr) await me.send(`${interaction.user} tried to use arrest command in ${interaction.guild}\n**ERROR:**\n Couldn't find friend role`).catch(O_o => console.log(O_o));
			if (!modlog || !criminals || !jail) await me.send(`${interaction.user} tried to use arrest command in ${interaction.guild}\n**ERROR:**\n Couldn't find one of the required channels`).catch(O_o => console.log(O_o));

			if (!interaction.guild.roles.cache.get(jailr)) return interaction.editReply({ content: `Jail role not found`, ephemeral: true });
			if (author.roles.highest.position < member.roles.highest.position) return interaction.editReply({ content: `I won't let you do that.`, ephemeral: true });
			if (member.roles.cache.has(jailr)) return interaction.editReply({ content: `${target} is already in jail`, ephemeral: true });

			// remove all roles and add role jail
			await member.roles.remove(member.roles.cache);
			await member.roles.add(jailr);

			// send criminals if friend
			const crimembed = new Discord.MessageEmbed()
				.setTitle(`**\`${target.id}\` has been jailed**`)
				.setDescription(`_ _\n**Reason:** Treason\n_ _`)
				.setColor('#ee0082')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/911697939435487232/tumblr_njtmof72q51unlqeso1_1280.png')
				.setTimestamp();

			if (member.roles.cache.has(friendr)) { await criminals.send({ embeds: [crimembed ] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`)); }

			// send embed in jail
			const ageembed = new Discord.MessageEmbed()
				.setTitle(`**__We suspect you to not meet the minimum age requirement of 18 years old.__**`)
				.setDescription('_ _')
				.addField('We need:', `1) A selfie of you holding a piece of paper with your Discord tag, the server name and the date.`, true)
				.addField('And:', `2) A clear picture of your ID with everything blurred out appart from the photo and date of birth.`, true)
				.addField('Where to send it to:', `Please type **__lsb verify__** to open a private ticket and send the pictures inside your private ticket\n\n**If you fail to do so within 48h we will ban you.**`, true)
				.setColor('#ee0082')
				.setThumbnail('https://media.discordapp.net/attachments/772471934231117834/911718877988286464/3d8.jpg?width=661&height=661')
				.setTimestamp();

			await jail.send({ content: `${target} **Verify you age!**`, embeds: [ageembed] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			// send dm
			const dmembed = new Discord.MessageEmbed()
				.setTitle(`You need to verify you age in ${interaction.guild}!`)
				.setDescription(`_ _\nMinimum Age Requirement: 18 years old.\n_ _`)
				.setColor('#ee0082')
				.setThumbnail(interaction.guild.iconURL())
				.setTimestamp();

			await target.send({ embeds: [dmembed] }).catch(O_o => console.log(O_o));

			// send modlog
			const modembed = new Discord.MessageEmbed()
				.setTitle(`:chains: **Member jailed** :chains:`)
				.setDescription(`_ _\n**Member:** ${target}\n\n**ID:** \`${target.id}\`\n\n**Jailed by:** ${interaction.user}\n_ _`)
				.setColor('#ee0082')
				.setThumbnail(target.displayAvatarURL())
				.setTimestamp();

			await modlog.send({ embeds: [modembed] }).catch(O_o => me.send(`${interaction.user} tried to user arrest command in ${interaction.guild}\n**ERROR:**\n${O_o}`));

			return interaction.editReply({ content: `${target} jailed`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: `**Something went wrong... Sorry**\n${error}!`, ephemeral: true });
		}

	},
};
const Discord = require('discord.js');

const { betar, logsc, owner } = require('./../../config.json');

module.exports = {
	name: 'beta',
	guildOnly: true,
	async execute(message) {
		try {
			const beta = message.guild.roles.cache.get(betar);
			const member = message.guild.members.cache.get(message.author.id);
			const logs = message.guild.channels.cache.get(logsc);

			const me = message.guild.members.cache.get(owner);
			if (!logs) await me.send(`${message.author} tried to use the beta command in ${message.server}\n**ERROR:**\nLogs channel not found`).catch(O_o => console.log(O_o));
			if (!beta) return message.channel.send('Beta role not found');

			if (member.roles.cache.has(betar)) {
				member.send(`You're already a beta tester`).catch(O_o => console.log(O_o));
				await message.delete();
			}

			if (!member.roles.cache.has(betar)) {
				await member.roles.add(beta);
				const betaembed = new Discord.MessageEmbed()
					.setTitle(`:space_invader:**New Beta Tester**:space_invader:`)
					.setDescription(`_ _\n${message.author} joined the Beta Test Team!\n\`${message.author.tag}, ${message.author.id}\``)
					.setColor('#a75aff')
					.setImage('https://cdn.discordapp.com/attachments/772471934231117834/913067152557342760/Screenshot_20211124-150138_1.png')
					.setTimestamp();

				logs.send({ embeds: [betaembed] }).catch(O_o => me.send({ content: `${message.author} tried to use beta command in ${message.guild}\n**ERROR:**\n${O_o}` }));
				await member.send(`Thank you for joining the beta tester team.\nPlease report all bugs and errors you get with LSB in the beta testing channel.`).catch(O_o => console.log(O_o));
				await message.delete();
			}

		}
		catch (error) {
			console.error(error);
		}
	},
};
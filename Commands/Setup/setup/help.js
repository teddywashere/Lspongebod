const Discord = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../../../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	async execute(interaction) {
		try {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Setup Guide`)
				.setDescription(`_ _\n**Before setting up anything else, please do: \`/setup error\`**\n> This channel should't get any error messages, so it can be set to your staff or admin chat.\nBy setting an error channel, you also register the server owner. __If the server ownership changes, rerun setup error__\n\n**Setting up roles: \`/setup roles\`**\n> Admin, Staff and Member roles are needed for the bot to function.\n> The other roles are used by their matching moderation commands.\n> everyone role id is needed for the tickets to work properly.\n\n**Setting up channels: \`/setup channels\`**\n> All of these are recommended, but not needed for the bot to function. Note there will __not__ be a warning if the logging channels are not available, so if you dont get any logs, double check the setup.\n\n**Setup other: \`/setup other\`**\n> Finetune bot, ticket and server settings.\n> You will not be able to backup the server without specifying a server template to use.\n\n_ _\n**__Ticket system:__**\n\nThe ticket channel, if set, will be the only channel members can open tickets in.\nIf not set, tickets can be opened anywhere in the server.\n\n\`[prefix] report\` is for report tickets, \`[prefix] support\` is for support tickets, \`[prefix] verify\` is for age verification, can only be used by a jailed member in the jail channel.\n\nThe **prefix** is **lsb** by default. You can change it with /setup other.\n\n_ _\n**Basic setup:**\nTo get the bot working, you need to run /setup error, then set admin, staff and member with /setup roles and lastly register the commands with /setup finish.\nIf you change the admin, staff or member roles, be sure to run /setup finish after changing the roles.\n\n *The ban command will check if the staff member actually has the ban member permission*\n_ _`)
				.setColor('#388ef9')
				.setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/930425013482426368/Adobe_20220111_123620.jpg')
				.setFooter(`bot owner: RainbowAlliance#7498`)
			
			return interaction.editReply( {content: `For further questions, bugreports and suggestions dm Rainbow.`, embeds: [embed], ephemeral: true });
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
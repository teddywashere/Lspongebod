const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const { token } = require('../config.json');
module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;
		let msg = message.content;
	  
		const emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g);
		if (!emojis) return;
		emojis.forEach(m => {
		  let emoji = client.emojis.cache.find(x => x.name === m)
		  if (!emoji) return;
		  let temp = emoji.toString()
		  if (new RegExp(temp, "g").test(msg)) msg = msg.replace(new RegExp(temp, "g"), emoji.toString())
		  else msg = msg.replace(new RegExp(":" + m + ":", "g"), emoji.toString());
		})
	  
		if (msg === message.content) return;
	  
		let webhook = await message.channel.fetchWebhooks();
		webhook = webhook.find(x => x.name === "NQN");
		if (!webhook) {
		  webhook = await message.channel.createWebhook(`NQN`, {
			avatar: client.user.displayAvatarURL({ dynamic: true })
		  });
		}
	  
		await webhook.edit({
		  name: message.member.nickname ? message.member.nickname : message.author.username,
		  avatar: message.author.displayAvatarURL({ dynamic: true })
		});
	  
		await message.delete().catch(O_o => {console.log(O_o)});
		await webhook.send(msg).catch(err => {console.log(O_O)});
	  
		return webhook.edit({
		  name: `NQN`,
		  avatar: client.user.displayAvatarURL({ dynamic: true })
		});
	  
	},
};
client.login(token);
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Setup = require('../DatabaseModels/Setup')(sequelize, Sequelize);

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const server = await Setup.findOne({ where: { guild_id: member.guild.id }});
        if (!server) return;
        const general = await member.guild.channels.cache.get(server.general_chat);
        if (!general) return;
        let heartEmoji = client.emojis.cache.get('760199043875602511');

		general.send({ content: `${member} **Welcome Home** <:rainbowheart:760199043875602511>\n\nCheck out <#814231713857273856> and <#795340377443008533>\nAnd subscribe to the <#814231261719298079> for fun stuff!` });

        client.login(server.token);
	},

};
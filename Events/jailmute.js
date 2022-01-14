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
const Mute = require('../DatabaseModels/jailmute')(sequelize, Sequelize);

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        try {
            const jailmute = await Mute.findOne({ where: { user_id: member.id, guild_id: member.guild.id }});
            if (jailmute) {
                const server = await Setup.findOne({ where: { guild_id: member.guild.id }});
                if (!server) return console.log('server not found...');
                if (jailmute.jail_status === 'true') {
                    const jail = await member.guild.roles.cache.get(server.jail_role);
                    if (!jail) return console.log('jail role not found...');
    
                    await member.roles.remove(member.roles.cache);
                    return member.roles.add(server.jail_role);
                }
                if (jailmute.mute_status === 'true') {
                    const mute = await member.guild.roles.cache.get(server.mute_role);
                    if (!mute) return console.log('mute role not found...');
    
                    return member.roles.add(server.mute_role);
                }
            }
        }
        catch(O_o) {
            console.log(O_o);
        }
	},

};

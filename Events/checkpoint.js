const cron = require('cron');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING] });

// rainbowfam 634117134913503244
// rainbowfam general 814231770852622408
const server = '788794708087275550';
const general = '825026451102629949';
const checkpoint = new Discord.MessageEmbed()
    .setTitle(`☆Hey there, you've arrived at a Discord checkpoint!☆`)
    .setDescription(`_ _\n》Are you thirsty? _ _ **Have a drink!**\n\n》Are you hungry? _ _ **Have a snack!**\n\n》Have you been sitting in the same position for ages? _ _ **Have a stretch!**\n\n》Are you feeling tense? _ _ **Have a stim break!**\n\n》Do you need to use the bathroom? _ _ **Go! Now!**\n\n》Are you tired? _ _ **Have a break!**\n\n》Are you too hot or too cold? _ _ **If you need to take off a layer or put one on, go do that now!**\n\n_ _\n**Hope you're all doing well and taking good care of yourselfs.**\n**__And remember to take a moment and be proud of yourself!__**\n_ _`)
    .setImage('https://cdn.discordapp.com/attachments/772471934231117834/930764486665711636/D5h3PJkWkAEhs5D.jpg')
    .setColor('RANDOM')
    .setFooter('We love you <3')

const check = new cron.CronJob('00 26 03 * * *', () => {
    const guild = client.guilds.cache.get(server);
    const here = guild.channels.cache.get(general);
    here.send({ embeds: [checkpoint] });
});

client.login(token);

module.exports = {
	check
};
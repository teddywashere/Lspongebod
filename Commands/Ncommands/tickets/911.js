

const { Permissions } = require('discord.js');

const Discord = require('discord.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Ticket = require('../../../DatabaseModels/Tickets') (sequelize, Sequelize);
const Mute = require('../../../DatabaseModels/jailmute') (sequelize, Sequelize);

module.exports = {
	name: '911',
	description: 'Report a user or message. Misuse is against the law.',
	usage: 'lsb 911 [while replying to a message] or [tag a user]',
	async execute(message, args) {
		try {
            // if (message.guild.id != '') return;
            // me is client id()
            const me = '825349710368997446';
            const logger = '926607829475917925';
            const friendr = '826501510996164659';
            const staffr = '788797220429758534';
            const adminr = '788797386515808339';
            const muter = '828002356150927390';
            const everyoner = '788794708087275550';
            const modlogc = await message.guild.channels.cache.get('825026359533371424')

            const author = await message.guild.members.cache.get(message.author.id);

			if (!author.roles.cache.has(friendr)) return console.log('was the member role');

            let member = message.mentions.users.first() || args[0];
            const reply = await message.fetchReference().catch(O_o => {
                if (O_o === 'MESSAGE_REFERENCE_MISSING') {
                    return message.reply('Please reply to a message when reporting it');
                }
            });

            if (!reply) return message.reply('Please reply to a message when reporting it.');
            if (reply) {
                const mem = await message.guild.members.cache.get(reply.author.id);
                if (mem.roles.cache.has(staffr) || mem.roles.cache.has(adminr)) return message.reply('They are official server staff. You can discuss a moderation issue by opening a <#795340258081898536>.\nThis hotline is for emergencies.');
                if (reply.author.id === message.author.id || reply.author.id === me) return message.reply('...is it a joke when nobodys laughing?');

                let reason = args.join(` `);
                if (!reason) reason = 'No reason given';

                const embed = new Discord.MessageEmbed()
                    .setTitle(`:oncoming_police_car: ${reply.author.tag}s message reported :oncoming_police_car:`)
                    .setDescription(`_ _\n**This message has been reported, because:**\n${reason}\n\n**We need at least one other person approving this report.**\n\n**If the report gets approved, the offending message will be deleted, the offending user muted, and a ticket with them and staff will be opened.**\n**__Blatant misuse of this command is against the law__**\n\n**Please react  with  :white_check_mark:  if you approve.**\n_ _`)
                    .setColor('#e31e33')
                    .setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/935532086029348934/Screenshot_20220125-144945_1_1_1.png');

                await message.channel.send(`<@&${staffr}> <@&${adminr}> code red`);
                const embedmessage = await reply.reply({ embeds: [embed] });

                Promise.all([
                    await embedmessage.react('✅'),
                ])
                    .catch(error => console.error('One of the emojis failed to react:', error));

                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id != reply.author.id && user.id != message.author.id && user.id != me;
                };
                const collector = await embedmessage.createReactionCollector({filter, max: 1});
                collector.on('collect', async (reaction, user) => {
                    const ticket = await message.guild.channels.create(`911-${reply.author.tag}`, {
                        permissionOverwrites: [
                            {
                                id: reply.author.id,
                                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                            },
                            {
                                id: logger,
                                allow: [Permissions.FLAGS.VIEW_CHANNEL],
                            },
                            {
                                id: staffr,
                                allow: [Permissions.FLAGS.VIEW_CHANNEL],
                            },
                            {
                                id: everyoner,
                                deny: [Permissions.FLAGS.VIEW_CHANNEL],
                            },
                        ],
                    });
                    await ticket.send(`<@&${staffr}> <@&${adminr}> <@${reply.author.id}>\n\nThis report has been innitiated by ${message.author.tag} and approved by ${user.tag}\n\n**__The offending message was:__**\n\`${reply.content}\`\n\n**Reason for reporting:**\n\`${reason}\``);

                    await mem.roles.add(muter).catch(O_O => {});
                    const jailmute = await Mute.findOne({ where: {user_id: reply.author.id, guild_id: message.guild.id }})
                    if (jailmute) {
                        await jailmute.update({ mute_status: 'true' }).catch(O_o => {console.log(O_o)});
                    }
                    if (!jailmute) {
                       await Mute.create({
                            user_id: reply.author.id,
                            guild_id: message.guild.id,
                            mute_status: 'true',
                        })
                    }
                    
                    await reply.delete();
                    await message.channel.send('Offender has been muted, message deleted and ticket opened.\n\nThank you for working together to protect the vibes <3');

                    await Ticket.create({
                        user_id: reply.author.id,
                        channel_id: ticket.id,
                        guild_id: message.guild.id,
                        type: '911',
                    })

                    const modlog = new Discord.MessageEmbed()
                    .setTitle(`:oncoming_police_car:Members message reported:oncoming_police_car:`)
                    .setDescription(`_ _\n**Member:** ${reply.author}\n\n**Tag:** ${reply.author.tag}\n\n**ID:** \`${reply.author.id}\`\n\n**Reported message:**\n\`${reply.content}\`\n\n**Reason:** ${reason}\n\n**Report initiated by:** ${message.author}\n**Tag:** ${message.author.tag}\n**ID:** \`${message.author.id}\`\n\n**Approved by:** ${user}\n**Tag:** ${user.tag}\n**ID:** \`${user.id}\`\n_ _`)
                    .setColor('#e31e33')
                    .setTimestamp()
                    .setThumbnail('https://cdn.discordapp.com/attachments/772471934231117834/935532086029348934/Screenshot_20220125-144945_1_1_1.png');

                    return modlogc.send({ embeds: [modlog]});
                });

                collector.on('end', collected => {
                });
            }
		}
		catch (O_o) {
			console.error(O_o);
		}
	},
};
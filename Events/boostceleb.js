module.exports = {
    name: 'guildMemberUpdate',
	once: true,
	async execute(oldMember, newMember) {
        if (newMember.guild.id != '788794708087275550') return console.log('the guild');
		const hadRole = await oldMember.roles.cache.get('825842956249595905');
        const hasRole = await newMember.roles.cache.get('825842956249595905');
  
// server booster role: 778982289878679592
// server id: 634117134913503244
// channel id: 814231770852622408

        if (!hadRole && hasRole) {
            const channel = await newMember.guild.channels.cache.get('825026451102629949');
            const rainbow = await newMember.guild.members.cache.get('759085690360954890');
            await channel.send(`<a:xxs_kleehype:936694317051949097>`);
            await channel.send(`${newMember} Thank you for supporting us! <a:xy_giflove:936925217459154974>`);
            await channel.send(`<a:xyz_catkiss:936682666600853514>`);
            await channel.send(`<a:w_jelly1:936682797450539008> Please dm ${rainbow} to get your booster rewards! <a:w_jelly1:936682797450539008>`);
            await channel.send(`<a:xxs_kleehype:936694317051949097>`);
        }
	},
};
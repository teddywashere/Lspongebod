module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag} in ${client.guilds.cache.size} guilds.`);
		client.user.setActivity('We love you! <3');
	},
};
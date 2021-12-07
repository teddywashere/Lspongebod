module.exports = {
	name: 'slash',
	description: 'How to use slash commands guide',
	async execute(message) {
		try {
			await message.reply({ content: `This video shows you how to use slash commands.\n\nThe first part is a known discord bug, where bots not available in the server you're in show up, and the one you want to use is not showing up.\nThis can be fixed by going into another server or dms, and back into the server you want to use slash commands in.\n\nThe second part is how to use slash commands.\n\nI hope this helps! Don't be afraid to ask Rainbow questions about it.\n\nhttps://cdn.discordapp.com/attachments/915163009511477248/915165716758528011/YouCut_20211130_100104473.mp4` });
		}
		catch (error) {
			console.error(error);
		}
	},
};
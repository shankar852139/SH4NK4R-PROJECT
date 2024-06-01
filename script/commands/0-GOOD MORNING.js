const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
		name: "good-morning",
		version: "1.0.1",
		hasPermssion: 0,
		credits: "SHANKAR SUMAN",
		description: "no prefix",
	usePrefix: false,
		commandCategory: "No command marks needed",
		usages: "Yo Yo",
		cooldowns: 5,
};

const gifs = [
		"https://i.ibb.co/hD1J9Zd/image.gif",
		"https://i.ibb.co/0GqpG3N/image.gif",
		"https://i.ibb.co/f2BBxcP/image.gif",
		"https://i.ibb.co/8mDJWgS/image.gif",
		"https://i.ibb.co/dGfbFyQ/image.gif",
		"https://i.ibb.co/pRqb3Y5/image.gif"
];

const messages = [
		"🌄ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ, {name}! ᴛʀʏ ꜱᴏᴍᴇ ᴄᴏꜰꜰᴇᴇ ᴏʀ ᴛᴇᴀ ᴛᴏ ᴡᴀᴋᴇ ʏᴏᴜ ᴜᴘ☀️☕",
		"🌅ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ, {name}! ʜᴀᴠᴇ ᴀ ᴡᴏɴᴅᴇʀꜰᴜʟ ᴅᴀʏ✨",
		"🌞ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ, {name}! ʟᴇᴛ'ꜱ ᴍᴀᴋᴇ ᴛʜɪꜱ ᴅᴀʏ ᴀᴡᴇꜱᴏᴍᴇ🌻",
		"gm {name} babu",
		"very good {name} babu",
		"good morning {name} babu"
];

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
		var { threadID, messageID } = event;
		var name = await Users.getNameUser(event.senderID);

		if (event.body.toLowerCase().startsWith("good morning") || 
				event.body.toLowerCase().startsWith("good gm") || 
				event.body.toLowerCase().startsWith("morning") || 
				event.body.toLowerCase().startsWith("bago paka gising") || 
				event.body.toLowerCase().startsWith("magandang araw")) { 

				// Select random GIF and message
				const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
				const randomMessage = messages[Math.floor(Math.random() * messages.length)].replace("{name}", name);
				const downloadPath = path.join(__dirname, 'Good-Morning-Gif-Images.gif');

				// Download image from Imgur
				request(randomGif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
						var msg = {
								body: randomMessage,
								attachment: fs.createReadStream(downloadPath)
						};
						api.sendMessage(msg, threadID, messageID);
						api.setMessageReaction("🌇", event.messageID, (err) => {}, true);
				});
		}
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

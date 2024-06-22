const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ram",
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
    "https://ibb.co/JnmSC0c",
    "https://ibb.co/ckQ00gz"
];

const messages = [
    "🥀🙏 जय श्री राम🙏🥀, {name}! बाबू 😇",
    "🥀🙏JAI SHREE RAM🙏🥀, {name}! BABU",
    "🥀🙏RAM RAM, {name}! JI",
    "🥀🙏 राम राम 🥀🙏 {name} बाबू 😇"
    
];

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
    var { threadID, messageID } = event;
    var name = await Users.getNameUser(event.senderID);

    if (event.body.toLowerCase().startsWith("ram") || 
        event.body.toLowerCase().startsWith("RAm") || 
        event.body.toLowerCase().startsWith("RAM") || 
        event.body.toLowerCase().startsWith("राम") || 
        event.body.toLowerCase().startsWith("Ram")) { 

        // Select random GIF and message
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)].replace("{name}", name);
        const downloadPath = path.join(__dirname, 'ram-Gif-Images.gif');

        // Download image from Imgur
        request(randomGif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
            var msg = {
                body: randomMessage,
                attachment: fs.createReadStream(downloadPath)
            };
            api.sendMessage(msg, threadID, messageID);
            api.setMessageReaction("🙏", event.messageID, (err) => {}, true);
        });
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

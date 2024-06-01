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

const gif = "https://i.imgur.com/BOkF9m9.jpg";
const message = "🥰𝗕𝗢𝗦𝗦 𝗜𝗦 𝗛𝗘𝗥𝗘❤️";

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
    var { threadID, messageID } = event;

    if (event.body.toLowerCase().startsWith("@Shankar Suman") || 
        event.body.toLowerCase().startsWith("boss") || 
        event.body.toLowerCase().startsWith("Shankar") || 
        event.body.toLowerCase().startsWith("Shankar") || 
        event.body.toLowerCase().startsWith("BOSS")) { 

        const downloadPath = path.join(__dirname, 'Boss-Jpg-Images.jpg');

        // Download image from Imgur
        request(gif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
            var msg = {
                body: message,
                attachment: fs.createReadStream(downloadPath)
            };
            api.sendMessage(msg, threadID, messageID);
            api.setMessageReaction("🥰", event.messageID, (err) => {}, true);
        });
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

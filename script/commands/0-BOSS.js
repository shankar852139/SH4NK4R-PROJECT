const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "boss",
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
    "https://i.imgur.com/BOkF9m9.jpg",
];

const messages = [
    "🥰𝗕𝗢𝗦𝗦 𝗜𝗦 𝗛𝗘𝗥𝗘❤️",
];

module.exports.handleEvent = async function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;

    if (event.body.toLowerCase().startsWith("boss") || 
        event.body.toLowerCase().startsWith("@Shankar Suman") || 
        event.body.toLowerCase().startsWith("SHANKAR") || 
        event.body.toLowerCase().startsWith("shankar") || 
        event.body.toLowerCase().startsWith("BOSS")) { 

        // Select random GIF and message
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const downloadPath = path.join(__dirname, 'Good-Morning-Gif-Images.gif');

        // Download image from Imgur
        request(randomGif)
            .pipe(fs.createWriteStream(downloadPath))
            .on('finish', () => {
                var msg = {
                    body: randomMessage,
                    attachment: fs.createReadStream(downloadPath)
                };
                api.sendMessage(msg, threadID, (err) => {
                    if (err) return console.error(err);
                    api.setMessageReaction("🥰", messageID, (err) => {
                        if (err) console.error(err);
                    }, true);
                });
            })
            .on('error', (err) => {
                console.error("Error downloading the image: ", err);
            });
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

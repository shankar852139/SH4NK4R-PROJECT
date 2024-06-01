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
    console.log("Received message:", event.body);

    if (event.body.toLowerCase().includes("boss") || 
        event.body.toLowerCase().includes("@Shankar Suman") || 
        event.body.toLowerCase().includes("shankar") || 
        event.body.toLowerCase().includes("boss")) { 
        console.log("Trigger words detected!");

        // Select random GIF and message
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const downloadPath = path.join(__dirname, 'Good-Morning-Gif-Images.gif');

        // Download image from Imgur
        request(randomGif)
            .pipe(fs.createWriteStream(downloadPath))
            .on('finish', () => {
                console.log("Image downloaded successfully.");

                var msg = {
                    body: randomMessage,
                    attachment: fs.createReadStream(downloadPath)
                };
                api.sendMessage(msg, threadID, (err) => {
                    if (err) return console.error("Error sending message:", err);
                    console.log("Message sent successfully.");
                    api.setMessageReaction("🥰", messageID, (err) => {
                        if (err) console.error("Error reacting to message:", err);
                        console.log("Reaction added successfully.");
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

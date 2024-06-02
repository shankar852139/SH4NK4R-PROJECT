const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "owner",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "SHANKAR SUMAN",
    description: "no prefix",
    usePrefix: false,
    commandCategory: "No command marks needed",
    usages: "shankar sir",
    cooldowns: 5,
};

const gif = "https://i.ibb.co/dDGV34c/image.gif";
const message = `ये लो ऑनर इंफॉर्मेशन 👈
🔰𝙊𝙒𝙉𝙀𝙍 𝙄𝙉𝙁𝙊🔰

•❅──────✧❅✦❅✧──────❅•

    🅾🆆🅽🅴🆁 ❈ ◦•≫ 𝑺𝑯𝑺𝑵𝑲𝑨𝑹 𝑺𝑼𝑴𝑨𝑵

𝐀𝐠𝐞 : 21

𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 𝐖𝐢𝐭𝐡 : 𝕂𝕆𝕀 ℕ𝕀

𝐅𝐫𝐨𝐦 : 𝐏𝐀𝐓𝐍𝐀☆𝐁𝐈𝐇𝐀𝐑

𝐒𝐭𝐮𝐝𝐲 : 𝗕 𝗧𝗲𝗰𝗵 IN THE FIELD OF 𝐂𝐨𝐦𝐩𝐮𝐭𝐞𝐫 𝐏𝐫𝐨𝐠𝐫𝐚𝐦𝐦𝐢𝐧𝐠

𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : [https://www.facebook.com/shankar.suman.98622733](https://www.facebook.com/shankar.suman.98622733)

𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 : SECRET H BOSS

нαм внι нση gαү вεωαғα кαнεη кιsι кι zιη∂αgι мα!❤🙂♣️`;

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
    var { threadID, messageID } = event;

    if (event.body.toLowerCase().startsWith("owner") || 
        event.body.toLowerCase().startsWith("malik")) { 

        const downloadPath = path.join(__dirname, 'owner-Jpg-Images.jpg');

        // Download image from Imgur
        request(gif).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
            var msg = {
                body: message,
                attachment: fs.createReadStream(downloadPath)
            };
            api.sendMessage(msg, threadID, messageID);
            api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        });
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

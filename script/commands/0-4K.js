module.exports.config = {
    name: "4k",
    version: "1.0.0",
    hasPermission: 0,
    credits: "SHANKAR SUMAN",
    description: "Command to get high resolution image",
    commandCategory: "Image Processing",
    usePrefix: false,
    cooldowns: 0
};

const sharp = require('sharp');
const fs = require('fs');
const download = require('image-downloader');

module.exports.run = function({ api, event }) {
    if (event.type !== "message_reply") return;
    if (event.messageReply.attachments.length === 0) return;

    const url = event.messageReply.attachments[0].url;

    const options = {
        url: url,
        dest: './temp.jpg'
    };

    download.image(options).then(({ filename }) => {
        sharp(filename)
            .resize({
                width: 3000,
                height: 3000,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
            .toFile('./high_resolution.jpg', (err, info) => {
                if (err) throw err;

                api.sendMessage({
                    attachment: fs.createReadStream('./high_resolution.jpg')
                }, event.threadID, () => {
                    fs.unlinkSync('./temp.jpg');
                    fs.unlinkSync('./high_resolution.jpg');
                });
            });
    });
}

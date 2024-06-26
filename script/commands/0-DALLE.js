const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "imagine",
    version: "1.0.2",
    author: "softrilez",
    countDown: 40,
    role: 0,
    description: "Generate image using DALL-E",
    category: "Dalle",
    usages: "[query]",
    guide: { en: "imagine <query>" }
};

module.exports.run = async function ({ api, event, args, usersData }) {
    const requiredQuota = 3;
    const senderID = event.senderID;
    const user = await usersData.get(senderID);

    if (requiredQuota > user.money) {
        return api.sendMessage("Kamu membutuhkan minimal 3 quota untuk menggunakan command ini.\nGunakan ;daily untuk mendapatkan credits.", event.threadID, event.messageID);
    }

    const query = args.join(" ");
    if (!query && (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== 'photo')) {
        return api.sendMessage(`Harap berikan petunjuk yang jelas!\nContoh: imagine pemandangan kota paris di tahun 2077`, event.threadID, event.messageID);
    }

    api.sendMessage("⏳ Generating your image...", event.threadID, async (error, info) => {
        if (error) return console.error(error);

        let prompt = query;
        let imagePath;

        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0].type === 'photo') {
            const imageUrl = event.messageReply.attachments[0].url;
            imagePath = path.join(__dirname, 'tmp', `${event.messageID}_prompt_image.png`);

            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                await fs.outputFile(imagePath, response.data);
                prompt = await global.utils.vision(imagePath);
            } catch (error) {
                console.error(error);
                return api.sendMessage("Gagal memproses gambar.", event.threadID, event.messageID);
            }
        }

        try {
            const response = await axios.get('https://apis-dalle-gen.onrender.com/dalle3', {
                params: { prompt }
            });

            const images = response.data.results.images;
            if (!images || images.length === 0) {
                return api.sendMessage("Tidak ada gambar yang ditemukan untuk kueri yang diberikan.", event.threadID, event.messageID);
            }

            const imageAttachments = [];
            for (let i = 0; i < Math.min(4, images.length); i++) {
                const imageResponse = await axios.get(images[i].url, { responseType: 'arraybuffer' });
                const imagePath = path.join(__dirname, 'tmp', `${event.messageID}_${i + 1}.png`);
                await fs.outputFile(imagePath, imageResponse.data);
                imageAttachments.push(fs.createReadStream(imagePath));
            }

            await usersData.set(senderID, {
                money: user.money - requiredQuota,
                data: user.data
            });

            await api.sendMessage({
                body: `Here are your generated images for: "${prompt}"`,
                attachment: imageAttachments
            }, event.threadID, event.messageID);

            // Clean up files
            for (const attachment of imageAttachments) {
                fs.unlink(attachment.path, (err) => {
                    if (err) console.error(`Error deleting file ${attachment.path}:`, err);
                });
            }
        } catch (error) {
            console.error(error);
            return api.sendMessage("Oops, an error occurred while generating the image.", event.threadID, event.messageID);
        }
    });
};

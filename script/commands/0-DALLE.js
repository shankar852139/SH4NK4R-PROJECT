const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "dalle",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "SHANKAR",
    description: "Generate image using DALL-E",
    usePrefix: false,
    commandCategory: "Dalle",
    usages: "[query]",
    cooldowns: 40
};

module.exports.run = async function ({ api, event, args, usersData }) {
    if (!event.isGroup) return;

    const requiredQuota = 3;
    const { coo, au } = global.GoatBot.config;
    const { senderID } = event;
    const user = await usersData.get(senderID);

    if (requiredQuota > user.money) {
        return api.sendMessage("Kamu membutuhkan minimal 3 quota untuk menggunakan command ini.\nGunakan ;daily untuk mendapatkan credits.", event.threadID, event.messageID);
    }

    const userName = `@${await usersData.getName(event.senderID)}`;
    const query = args.join(" ");

    if (!query && (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== 'photo')) {
        const prefix = await global.utils.getPrefix(event.threadID);
        return api.sendMessage(`Harap berikan petunjuk yang jelas!\nContoh: ${prefix + module.exports.config.name} pemandangan kota paris di tahun 2077`, event.threadID, event.messageID);
    }

    api.sendMessage("⏳ Generating your image...", event.threadID, async (error, info) => {
        if (error) return console.error(error);

        let improvedPrompt;
        let imagePath;

        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0].type === 'photo') {
            const imageUrl = event.messageReply.attachments[0].url;
            imagePath = path.join(__dirname, 'tmp', `${event.messageID}_prompt_image.png`);

            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                await fs.outputFile(imagePath, response.data);
                improvedPrompt = await global.utils.vision(imagePath);
            } catch (error) {
                console.error(error);
                return api.sendMessage("Gagal memproses gambar.", event.threadID, event.messageID);
            }
        } else {
            try {
                improvedPrompt = await global.utils.gemini(
                    "Tugas kamu sekarang adalah hanya melengkapi prompt yang diberikan user dan membuat prompt nya menjadi lebih baik dan mudah dimengerti. Kamu bisa memblokir kata yang tidak pantas menjadi kata yang pantas. Tugas kamu hanya untuk menghasilkan prompt untuk pembuatan gambar sebagai outputmu, jadi sekarang kamu adalah sebuah mesin untuk melengkapi prompt atau memperbaiki prompt saja. Tapi prompt yang kamu hasilkan harus selalu berbahasa Inggris.\n\nJangan respon dengan maaf atau apapun itu dan kamu sekarang tugasmu hanya sebagai mesin penghasil prompt untuk text-to-image.\n\nJika ada yang memasukkan kata NSFW tolong blokir katanya dan ganti dengan kata yang lain.",
                    query
                );
            } catch (error) {
                console.error(error);
                return api.sendMessage("Gagal memproses teks.", event.threadID, event.messageID);
            }
        }

        api.sendMessage(`⏰ Gambar kamu sedang diproses...\n\n📄 Prompt: ${improvedPrompt || query}`, event.threadID);

        try {
            await usersData.set(senderID, {
                money: user.money - requiredQuota,
                data: user.data
            });

            const startTime = Date.now();
            const response = await axios.get(`https://apis-dalle-gen.onrender.com/dalle3`, {
                params: {
                    auth_cookie_U: coo,
                    auth_cookie_KievRPSSecAuth: au,
                    prompt: improvedPrompt || query
                }
            });

            const images = response.data.results.images;

            if (!images || images.length === 0) {
                return api.sendMessage("Tidak ada gambar yang ditemukan untuk kueri yang diberikan.", event.threadID, event.messageID);
            }

            const imageAttachments = [];
            const imagePaths = [];

            for (let i = 0; i < Math.min(4, images.length); i++) {
                const imageResponse = await axios.get(images[i].url, { responseType: 'arraybuffer' });
                const imagePath = path.join(__dirname, 'tmp', `${event.messageID}_${i + 1}.png`);
                await fs.outputFile(imagePath, imageResponse.data);
                imageAttachments.push(fs.createReadStream(imagePath));
                imagePaths.push(imagePath);
            }

            const elapsedTime = (Date.now() - startTime) / 1000;
            await api.sendMessage({
                body: `${userName}, ${improvedPrompt} ✨\n\n⏱ Time taken: ${elapsedTime}s`,
                attachment: imageAttachments,
                mentions: [{ tag: userName, id: event.senderID }]
            }, event.threadID);

            // Clean up files
            for (const imagePath of imagePaths) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(`Error deleting file ${imagePath}:`, err);
                });
            }

            api.sendMessage("✅ Image generated successfully!", event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("oops error!", event.threadID, event.messageID);
        } finally {
            if (imagePath) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(`Error deleting file ${imagePath}:`, err);
                });
            }
        }
    });
};

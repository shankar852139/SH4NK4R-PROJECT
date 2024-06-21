const axios = require('axios');

module.exports.config = {
    name: "ss",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "other",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const id = event.senderID;

    if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

    try {
        api.sendMessage("Typing......", event.threadID);

        // Blackbox AI API endpoint
        const apiUrl = `https://blackboxai-api.herokuapp.com/api/converse`;

        const data = {
            input: content,
            userId: id
        };

        const response = await axios.post(apiUrl, data);
        const result = response.data.response;

        const userNames = await getUserNames(api, event.senderID);
        const responseMessage = `${result}\n\n👤 𝖰𝗎𝖾𝗌𝗍𝗂𝗈𝗇 𝖠𝗌𝗄𝖾𝖽 𝖻𝗒: ${userNames.join(', ')}`;

        api.sendMessage(responseMessage, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

async function getUserNames(api, uid) {
    const user = await api.getUserInfo(uid);
    return Object.values(user).map(u => u.name);
}

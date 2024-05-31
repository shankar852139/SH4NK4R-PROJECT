module.exports.config = {
    name: "goodmorning",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHANKAR SUMAN",
    description: "Responds to good morning messages with a new message and GIF",
    commandCategory: "greetings",
    usePrefix: false,
    usages: "",
    cooldowns: 5,
    dependencies: {
        "axios": "",
    }
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID, body } = event;

    // List of good morning messages
    const messages = [
        "Very good morning {name} babu!",
        "Good morning {name} babu!",
        "GM {name} babu!",
        "Good morning, have a great day {name} babu!"
    ];

    // List of GIF URLs
    const gifUrls = [
        "https://i.imgur.com/gMt1SXS.gif",
        "https://i.imgur.com/xBwIQfe.gif",
        "https://i.imgur.com/cSXYa6o.gif",
        "https://i.imgur.com/1OljKCJ.gif"
    ];

    // Check if the message contains any form of "good morning"
    if (/gm|good morning|Gm/i.test(body)) {
        try {
            const userName = await Users.getNameUser(senderID);
            const message = messages[Math.floor(Math.random() * messages.length)].replace("{name}", userName);
            const gifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

            // Send GIF as attachment
            const axios = require("axios");
            const response = await axios.get(gifUrl, { responseType: 'stream' });
            const attachment = response.data;

            api.sendMessage({ body: message, attachment }, threadID, messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while sending the good morning message.", threadID, messageID);
        }
    }
};

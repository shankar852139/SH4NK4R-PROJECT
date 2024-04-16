const axios = require('axios');

let chatEnabled = true; // Switch to control chatbot on/off

module.exports.config = {
    name: "harold",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Chating With Harold Hutchins",
    usePrefix: false,
    commandCategory: "Chatbot",
    usages: "[on/off]",
    cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
    const command = args[0];
    
    if (command === 'on') {
        chatEnabled = true;
        return api.sendMessage("Chatbot is now ON", event.threadID, event.messageID);
    }

    if (command === 'off') {
        chatEnabled = false;
        return api.sendMessage("Chatbot is now OFF", event.threadID, event.messageID);
    }

    if (!chatEnabled) return; // Check if chatbot is enabled

    const content = encodeURIComponent(args.join(" "));
    const id = event.senderID;  

    if (!content) return api.sendMessage("Hello There I'm Harold Hutchins Chatbot made by Jonell Magallanes Haha", event.threadID, event.messageID);
    api.setMessageReaction("💭", event.messageID, () => { }, true);

    try {
        const response = await axios.get(`https://harolai-71030c5ce4eb.herokuapp.com/harold?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.setMessageReaction("💚", event.messageID, () => { }, true);
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer Jonell Magallanes Thanks", event.threadID);
        api.setMessageReaction("😭", event.messageID, () => { }, true);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!chatEnabled || !event.body || !event.isGroup) return; // Check if chatbot is enabled and if the event is valid

    const content = encodeURIComponent(event.body);
    const id = event.senderID;  

    api.setMessageReaction("💭", event.messageID, () => { }, true);

    try {
        const response = await axios.get(`https://harolai-71030c5ce4eb.herokuapp.com/harold?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.setMessageReaction("💚", event.messageID, () => { }, true);
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer Jonell Magallanes Thanks", event.threadID);
        api.setMessageReaction("😭", event.messageID, () => { }, true);
    }
};

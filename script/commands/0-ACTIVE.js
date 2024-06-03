const moment = require('moment');

module.exports.config = {
    name: "active",
    version: "1.0.0",
    hasPermission: 0,
    credits: "SHANKAR SUMAN",
    description: "Check for active members",
    usePrefix: false,
    commandCategory: "system",
    cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event, Users }) => {
    if (Object.keys(event.mentions).length > 0) {
        let threadID = event.threadID;
        let messageID = event.messageID;
        
        for (let mention in event.mentions) {
            let data = await Users.getData(mention);
            let userName = data.name;
            if(data.hasOwnProperty('lastOnline') && data.lastOnline != null){
                api.sendMessage(`${userName} was last active ${moment(data.lastOnline).fromNow()}`, threadID, messageID);
            } else {
                api.sendMessage(`${userName} is mentioned but seems to be offline.`, threadID, messageID);
            }
        }
    }
};

module.exports.run = async ({ api, Users, event }) => {
    for (const key in event.mentions) {
        let data = await Users.getData(key);
        let lastOnlineTime = data.lastOnline;
        if (lastOnlineTime != null) {
            let lastOnlineDate = moment(lastOnlineTime);
            let currentTime = moment();
            if (currentTime.diff(lastOnlineDate, 'minutes') > 5) {
                api.sendMessage(`${data.name} has been offline for ${currentTime.diff(lastOnlineDate, 'minutes')} minutes.`, event.threadID, event.messageID);
            } else {
                api.sendMessage(`${data.name} is currently active.`, event.threadID, event.messageID);
            }
        } else {
            api.sendMessage(`${data.name} has never been online before.`, event.threadID, event.messageID);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

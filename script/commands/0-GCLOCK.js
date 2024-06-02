const { createReadStream, createWriteStream } = require('fs');
const { resolve } = require('path');
const adminID = '100058415170590';

module.exports.config = {
    name: "groupLock",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHANKAR SUMAN",
    description: "Lock group settings",
    commandCategory: "Group",
    usePrefix: false,
    cooldowns: 5,
    dependencies: {
        "fs": "",
        "path": ""
    }
};

const settingsPath = resolve(__dirname, 'groupSettings.json');
let groupSettings = {};

// Load group settings from file
try {
    groupSettings = require(settingsPath);
} catch (error) {
    // If the file doesn't exist, create an empty settings object
    groupSettings = {};
}

function saveSettings() {
    const settingsString = JSON.stringify(groupSettings, null, 4);
    createWriteStream(settingsPath).write(settingsString);
}

module.exports.handleEvent = async function ({ api, event, client }) {
    const { threadID, messageID, senderID, body } = event;

    if (!groupSettings[threadID]) {
        groupSettings[threadID] = {
            lockedName: '',
            lockedAvatar: '',
            lockedNicknames: {}
        };
        saveSettings();
    }

    // Lock group name
    if (event.logMessageType === 'log:thread-name') {
        const newName = event.logMessageData.name || '';
        const lockedName = groupSettings[threadID].lockedName;
        
        if (newName !== lockedName && senderID !== adminID) {
            api.setTitle(lockedName, threadID);
            api.sendMessage(`Group name is locked to "${lockedName}". Only the bot admin can change it.`, threadID);
        } else {
            groupSettings[threadID].lockedName = newName;
            saveSettings();
        }
    }

    // Lock group avatar
    if (event.logMessageType === 'log:thread-icon') {
        const newAvatar = event.logMessageData.thread_icon || '';
        const lockedAvatar = groupSettings[threadID].lockedAvatar;
        
        if (newAvatar !== lockedAvatar && senderID !== adminID) {
            api.changeThreadIcon(lockedAvatar, threadID);
            api.sendMessage(`Group avatar is locked. Only the bot admin can change it.`, threadID);
        } else {
            groupSettings[threadID].lockedAvatar = newAvatar;
            saveSettings();
        }
    }

    // Lock nicknames
    if (event.logMessageType === 'log:user-nickname') {
        const { participant_id, nickname } = event.logMessageData;
        const lockedNicknames = groupSettings[threadID].lockedNicknames;

        if (lockedNicknames[participant_id] && lockedNicknames[participant_id] !== nickname && senderID !== adminID) {
            api.changeNickname(lockedNicknames[participant_id], threadID, participant_id);
            api.sendMessage(`Nickname is locked for this user. Only the bot admin can change it.`, threadID);
        } else {
            lockedNicknames[participant_id] = nickname;
            saveSettings();
        }
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if (senderID !== adminID) {
        return api.sendMessage('You do not have permission to use this command.', threadID, messageID);
    }

    const action = args[0];
    const value = args.slice(1).join(' ');

    if (!groupSettings[threadID]) {
        groupSettings[threadID] = {
            lockedName: '',
            lockedAvatar: '',
            lockedNicknames: {}
        };
    }

    switch (action) {
        case 'lockname':
            groupSettings[threadID].lockedName = value;
            api.setTitle(value, threadID);
            api.sendMessage(`Group name locked to "${value}".`, threadID);
            break;
        case 'lockavatar':
            groupSettings[threadID].lockedAvatar = value;
            // This function assumes `value` is a URL to an image file.
            const localFilePath = resolve(__dirname, 'avatar.png');
            const file = createWriteStream(localFilePath);
            http.get(value, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    api.changeThreadIcon(createReadStream(localFilePath), threadID);
                    api.sendMessage(`Group avatar locked.`, threadID);
                });
            });
            break;
        case 'locknickname':
            const [userID, ...nicknameParts] = args.slice(1);
            const nickname = nicknameParts.join(' ');
            groupSettings[threadID].lockedNicknames[userID] = nickname;
            api.changeNickname(nickname, threadID, userID);
            api.sendMessage(`Nickname locked for user ${userID}.`, threadID);
            break;
        default:
            api.sendMessage('Invalid action. Use lockname, lockavatar, or locknickname.', threadID);
            break;
    }

    saveSettings();
};

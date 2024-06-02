const { createReadStream, createWriteStream, writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');
const http = require('http');
const adminID = '100058415170590';

module.exports.config = {
    name: "groupLock",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHSNKAR SUMAN",
    description: "Lock group settings",
    commandCategory: "Group",
    usePrefix: false,
    cooldowns: 5,
    dependencies: {
        "fs": "",
        "path": "",
        "http": ""
    }
};

const settingsPath = resolve(__dirname, 'groupSettings.json');
let groupSettings = {};

// Load group settings from file
try {
    const data = readFileSync(settingsPath, 'utf8');
    groupSettings = JSON.parse(data);
} catch (error) {
    // If the file doesn't exist or there's an error, create an empty settings object
    groupSettings = {};
}

function saveSettings() {
    writeFileSync(settingsPath, JSON.stringify(groupSettings, null, 4));
}

module.exports.handleEvent = async function ({ api, event, client }) {
    const { threadID, messageID, senderID, body } = event;

    if (!groupSettings[threadID]) {
        groupSettings[threadID] = {
            lockedName: '',
            lockedAvatar: '',
            lockedNicknames: {},
            antiName: false,
            antiAvatar: false,
            antiNickname: false
        };
        saveSettings();
    }

    const groupSetting = groupSettings[threadID];

    // Lock group name
    if (groupSetting.antiName && event.logMessageType === 'log:thread-name') {
        const newName = event.logMessageData.name || '';
        const lockedName = groupSetting.lockedName;
        
        if (newName !== lockedName && senderID !== adminID) {
            api.setTitle(lockedName, threadID);
            api.sendMessage(`Group name is locked to "${lockedName}". Only the bot admin can change it.`, threadID);
        } else {
            groupSetting.lockedName = newName;
            saveSettings();
        }
    }

    // Lock group avatar
    if (groupSetting.antiAvatar && event.logMessageType === 'log:thread-icon') {
        const newAvatar = event.logMessageData.thread_icon || '';
        const lockedAvatar = groupSetting.lockedAvatar;
        
        if (newAvatar !== lockedAvatar && senderID !== adminID) {
            api.changeThreadIcon(lockedAvatar, threadID);
            api.sendMessage(`Group avatar is locked. Only the bot admin can change it.`, threadID);
        } else {
            groupSetting.lockedAvatar = newAvatar;
            saveSettings();
        }
    }

    // Lock nicknames
    if (groupSetting.antiNickname && event.logMessageType === 'log:user-nickname') {
        const { participant_id, nickname } = event.logMessageData;
        const lockedNicknames = groupSetting.lockedNicknames;

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
        return api.sendMessage('Aapko is command ka use karne ka permission nahi hai.', threadID, messageID);
    }

    const action = args[0];
    const value = args.slice(1).join(' ');

    if (!groupSettings[threadID]) {
        groupSettings[threadID] = {
            lockedName: '',
            lockedAvatar: '',
            lockedNicknames: {},
            antiName: false,
            antiAvatar: false,
            antiNickname: false
        };
    }

    const groupSetting = groupSettings[threadID];

    switch (action) {
        case 'lockname':
            groupSetting.lockedName = value;
            api.setTitle(value, threadID);
            api.sendMessage(`Group name locked to "${value}".`, threadID);
            break;
        case 'lockavatar':
            groupSetting.lockedAvatar = value;
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
            groupSetting.lockedNicknames[userID] = nickname;
            api.changeNickname(nickname, threadID, userID);
            api.sendMessage(`Nickname locked for user ${userID}.`, threadID);
            break;
        case 'anti':
            if (value === 'name on') {
                groupSetting.antiName = true;
                api.getThreadInfo(threadID, (err, info) => {
                    if (err) return console.error(err);
                    groupSetting.lockedName = info.threadName;
                    saveSettings();
                    api.sendMessage(`Group name locking is now ON.`, threadID);
                });
            } else if (value === 'nickname on') {
                groupSetting.antiNickname = true;
                api.getThreadInfo(threadID, (err, info) => {
                    if (err) return console.error(err);
                    info.participantIDs.forEach(id => {
                        groupSetting.lockedNicknames[id] = info.nicknames[id] || "";
                    });
                    saveSettings();
                    api.sendMessage(`Nickname locking is now ON.`, threadID);
                });
            } else if (value === 'avt on') {
                groupSetting.antiAvatar = true;
                api.getThreadInfo(threadID, (err, info) => {
                    if (err) return console.error(err);
                    groupSetting.lockedAvatar = info.imageSrc || "";
                    saveSettings();
                    api.sendMessage(`Group avatar locking is now ON.`, threadID);
                });
            } else {
                api.sendMessage('Invalid anti command. Use "anti name on", "anti nickname on", or "anti avt on".', threadID);
            }
            break;
        default:
            api.sendMessage('Invalid action. Use lockname, lockavatar, locknickname, or anti.', threadID);
            break;
    }

    saveSettings();
};

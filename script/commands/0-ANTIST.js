module.exports.config = {
  name: "anti",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "Lock group name, nickname, and profile picture",
  usePrefix: false,
  commandCategory: "group",
  usages: "[on/off] [name/nickname/avt]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const [mode, type] = args;

  if (!mode || !type) return api.sendMessage("Invalid command syntax.", threadID, messageID);

  let isOn = mode === "on";
  let setting;

  switch (type) {
    case "name":
      setting = "groupNameLock";
      break;
    case "nickname":
      setting = "nickNameLock";
      break;
    case "avt":
      setting = "avtLock";
      break;
    default:
      return api.sendMessage("Invalid type.", threadID, messageID);
  }

  try {
    if (isOn) {
      // Lock the setting
      await api.updateThreadSettings(threadID, {
        [setting]: true
      });
      api.sendMessage(`Locked ${type} successfully! 🔒`, threadID, messageID);
    } else {
      // Unlock the setting
      await api.updateThreadSettings(threadID, {
        [setting]: false
      });
      api.sendMessage(`Unlocked ${type} successfully! 🔓`, threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while locking/unlocking the setting.", threadID, messageID);
  }
};

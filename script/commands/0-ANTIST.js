module.exports.config = {
  name: "anti",
  credits: "SHANKAR SUMAN",
  hasPermission: 1,
  usePrefix: false,
  dependencies: {
    "imgbb-uploader": "",
    "axios": "",
    "fs": ""
  },
  description: "Ban something in the group",
  usages: "< nickname/boximage/boxname >",
  commandCategory: "Chat Box"
};

const isBoolean = (val) => typeof val === "boolean";

module.exports.run = async ({ api, event, args, Threads }) => {
  try {
    const { threadID, messageID, senderID } = event;

    if (senderID === threadID) return;

    const data = await getAntiModeData(threadID);

    if (!data) {
      await createAntiModeData(threadID);
      data = await getAntiModeData(threadID);
    }

    const setting = args[0]?.toLowerCase();
    const _switch = args[1]?.toLowerCase();

    switch (setting) {
      case "nickname":
        toggleBan(data, "nickname", _switch);
        break;
      case "boximage":
        toggleBan(data, "boximage", _switch);
        break;
      case "boxname":
        toggleBan(data, "boxname", _switch);
        break;
      case "theme":
        toggleBan(data, "theme", _switch);
        break;
      case "emoji":
        toggleBan(data, "emoji", _switch);
        break;
      default:
        return api.sendMessage(`Invalid setting: ${setting}`, threadID);
    }

    await updateAntiModeData(threadID, data);

    return api.sendMessage(`[ 𝗠𝗢𝗗𝗘 ] → Anti mode ${setting}: ${data.antist[setting] ? 'On' : 'Off'}`, threadID);
  } catch (e) {
    console.log(e);
    api.sendMessage("[ 𝗠𝗢𝗗𝗘 ] → An error occurred while executing the command", threadID);
  }
};

const getAntiModeData = async (threadID) => {
  const data = await global.modelAntiSt.findOne({ where: { threadID } });
  return data?.data;
};

const createAntiModeData = async (threadID) => {
  await global.modelAntiSt.create({ threadID, data: {} });
};

const updateAntiModeData = async (threadID, data) => {
  await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
};

const toggleBan = (data, setting, _switch) => {
  if (_switch === "on") {
    data.antist[setting] = true;
  } else if (_switch === "off") {
    data.antist[setting] = false;
  } else {
    data.antist[setting] = !data.antist[setting];
  }
};

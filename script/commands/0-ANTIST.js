module.exports.config = {
  name: "antist",
  credits: "SHANKAR",
  hasPermssion: 1, // Only bot admin can use this command
  usePrefix: false,
  dependencies: {
    "imgbb-uploader": "",
    "axios": "",
    "fs": ""
  },
  description: "Group me kuch cheezon ko rokne ke liye",
  usages: "< nickname/boximage/boxname/emoji/theme >",
  commandCategory: "group"
};

const isBoolean = val => 'boolean' === typeof val;

module.exports.run = async ({ api, event, args, Threads }) => {
  try {
    const { threadID, messageID, senderID } = event;
    const threadInfo = await api.getThreadInfo(threadID);
    
    // Check if sender is bot admin
    if (!threadInfo.adminIDs.some(admin => admin.id == senderID)) {
      return api.sendMessage("Aapko sirf bot admin hi is command ko use karne ki permission hai.", threadID, messageID);
    }
    
    let threadData = await global.modelAntiSt.findOne({ where: { threadID } });
    if (!threadData) {
      await global.modelAntiSt.create({ threadID, data: {} });
      threadData = { data: {} };
    }

    const data = threadData.data;
    if (!data.hasOwnProperty("antist")) {
      data.antist = {};
    }
    if (!data.hasOwnProperty("antist_info")) {
      data.antist_info = {};
    }

    const setting = args[0]?.toLowerCase();
    const _switch = args[1]?.toLowerCase();

    switch (setting) {
      case 'nickname': {
        if (_switch === "on") data.antist.nickname = true;
        else if (_switch === "off") data.antist.nickname = false;
        else data.antist.nickname = !data.antist.nickname;

        if (data.antist.nickname) {
          const { nicknames } = await api.getThreadInfo(threadID) || {};
          if (!nicknames) return api.sendMessage("[ MODE ] → Command execute karte samay error aayi", threadID);
          data.antist_info.nicknames = nicknames;
        } else {
          data.antist_info.nicknames = null;
        }
        break;
      }
      case 'boximage': {
        if (_switch === "on") data.antist.boximage = true;
        else if (_switch === "off") data.antist.boximage = false;
        else data.antist.boximage = !data.antist.boximage;

        if (data.antist.boximage) {
          const fs = global.nodemodule["fs"];
          const axios = global.nodemodule["axios"];
          const uploadIMG = global.nodemodule["imgbb-uploader"];

          const { imageSrc } = await api.getThreadInfo(threadID) || {};
          if (!imageSrc) return api.sendMessage("Aapke group me koi image nahi hai...", threadID);
          const imageStream = (await axios.get(imageSrc, { responseType: 'arraybuffer' })).data;
          const pathToImage = __dirname + `/cache/imgbb_antist_${Date.now()}.png`;
          fs.writeFileSync(pathToImage, Buffer.from(imageStream, 'utf-8'));
          const { url } = await uploadIMG("c4847250684c798013f3c7ee322d8692", pathToImage);

          fs.unlinkSync(pathToImage);

          data.antist_info.imageSrc = url;
        } else {
          data.antist_info.imageSrc = null;
        }
        break;
      }
      case 'boxname': {
        if (_switch === "on") data.antist.boxname = true;
        else if (_switch === "off") data.antist.boxname = false;
        else data.antist.boxname = !data.antist.boxname;

        if (data.antist.boxname) {
          const { name } = await api.getThreadInfo(threadID) || {};
          if (!name) return api.sendMessage("Group ka koi naam nahi hai", threadID);
          data.antist_info.name = name;
        } else {
          data.antist_info.name = null;
        }
        break;
      }
      case "theme": {
        if (_switch === "on") data.antist.theme = true;
        else if (_switch === "off") data.antist.theme = false;
        else data.antist.theme = !data.antist.theme;

        if (!global.client.antistTheme) global.client.antistTheme = {};
        if (data.antist.theme) {
          return api.sendMessage('Please group settings me jaake ek theme select karein jo default theme banegi', threadID, (err, info) => {
            if (err) console.log(err);
            global.client.antistTheme[threadID] = {
              threadID,
              messageID: info.messageID,
              author: senderID,
              run: async function (themeID, accessibility_label) {
                delete global.client.antistTheme[threadID];
                const updatedData = await global.modelAntiSt.findOne({ where: { threadID } });
                const data = updatedData.data;
                data.antist.theme = true;
                data.antist_info.themeID = themeID;
                api.sendMessage('Default theme saved as: ' + accessibility_label, threadID);
                await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
              }
            };
          });
        }
        break;
      }
      case "emoji": {
        if (_switch === "on") data.antist.emoji = true;
        else if (_switch === "off") data.antist.emoji = false;
        else data.antist.emoji = !data.antist.emoji;

        if (data.antist.emoji) {
          const { emoji } = await api.getThreadInfo(threadID) || {};
          data.antist_info.emoji = emoji;
        } else {
          data.antist_info.emoji = null;
        }
        break;
      }
      default:
        return api.sendMessage(`====== [ GUIDE ] ======
\n\n━━━━━━━━━━━━━━━━\n\n- anti boxname: Enable/Disable prohibiting changing the group name\n- anti boximage: Enable/Disable prohibiting changing the group image\n- anti nickname: Enable/Disable prohibiting changing member nicknames\n- anti emoji: Enable/Disable prohibiting changing the group icon\n- anti theme: Enable/Disable prohibiting changing the group theme`, threadID);
    }

    await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
    return api.sendMessage(`[ MODE ] → Anti ${setting} mode: ${data.antist[setting] ? 'Enabled' : 'Disabled'}`, threadID);
  } catch (e) {
    console.log(e);
    api.sendMessage("[ MODE ] → Command execute karte samay error aayi", threadID);
  }
};

module.exports.config = {
  name: "anti",
  version: "4.1.5",
  hasPermission: 1,
  credits: "SHANKAR",
  description: "Anti various group attributes",
  commandCategory: "Administrator",
  usePrefix: false,
  usages: "anti [options] on/off",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
  },
};

const {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
} = require("fs");
const axios = require('axios')

module.exports.handleReply = async function ({
  api,
  event,
  args,
  handleReply,
}) {
  const { senderID, threadID, messageID, messageReply } = event;
  const { author, permission } = handleReply;
  
  const pathData = global.anti;
  const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

  if(author !== senderID) return api.sendMessage(`❎ You are not authorized to use this command`, threadID);

  var number = event.args.filter(i => !isNaN(i));
  for (const num of number){
    switch (num) {
      case "1": {
        //---> CODE ADMIN ONLY<---//
        if (permission < 1)
          return api.sendMessage(
            "⚠️ You do not have sufficient permissions to use this command",
            threadID,
            messageID
          );
        var NameBox = dataAnti.boxname;
        const antiImage = NameBox.find(
          (item) => item.threadID === threadID
        );
        if (antiImage) {
          dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "✅ Successfully turned off anti-change box name",
            threadID,
            messageID
          );
        } else {
          var threadName = (await api.getThreadInfo(event.threadID)).threadName;
          dataAnti.boxname.push({
            threadID,
            name: threadName
          });
          api.sendMessage(
            "✅ Successfully turned on anti-change box name",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "2": {
        if (permission < 1)
          return api.sendMessage(
            "⚠️ You do not have sufficient permissions to use this command",
            threadID,
            messageID
          );
        const antiImage = dataAnti.boximage.find(
          (item) => item.threadID === threadID
        );
        if (antiImage) {
          dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "✅ Successfully turned off anti-change box image",
            threadID,
            messageID
          );
        } else {
          var threadInfo = await api.getThreadInfo(event.threadID);
          var options = {
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
              Authorization: "Client-ID fc9369e9aea767c",
            },
            data: {
              image: threadInfo.imageSrc,
            },
          };
          const res = await axios(options);

          var data = res.data.data;
          var img = data.link;
          dataAnti.boximage.push({
            threadID,
            url: img,
          });
          api.sendMessage(
            "✅ Successfully turned on anti-change box image",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "3": {
        if (permission < 1)
          return api.sendMessage(
            "⚠️ You do not have sufficient permissions to use this command",
            threadID,
            messageID
          );
        const NickName = dataAnti.antiNickname.find(
          (item) => item.threadID === threadID
        );
        
        if (NickName) {
          dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
          api.sendMessage(
            "✅ Successfully turned off anti-change nickname",
            threadID,
            messageID
          );
        } else {
          const nickName = (await api.getThreadInfo(event.threadID)).nicknames;
          dataAnti.antiNickname.push({
            threadID,
            data: nickName
          });
          api.sendMessage(
            "✅ Successfully turned on anti-change nickname",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      /*case "4": {
        if (permission < 1)
          return api.sendMessage(
            "⚠️ You do not have sufficient permissions to use this command",
            threadID,
            messageID
          );
        const antiout = dataAnti.antiout;
        if (antiout[threadID] == true) {
          antiout[threadID] = false;
          api.sendMessage(
            "✅ Successfully turned off anti-out mode",
            threadID,
            messageID
          );
        } else {
          antiout[threadID] = true;
          api.sendMessage(
            "✅ Successfully turned on anti-out mode",
            threadID,
            messageID
          );
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }*/
      case "4": {
        const antiImage = dataAnti.boximage.find(
          (item) => item.threadID === threadID
        );
        const antiBoxname = dataAnti.boxname.find(
          (item) => item.threadID === threadID
        );
        const antiNickname = dataAnti.antiNickname.find(
          (item) => item.threadID === threadID
        );
        return api.sendMessage(
          `[ CHECK ANTI ]\n\nAnti box name -> ${antiBoxname ? "true" : "false"}\nAnti box image -> ${antiImage ? "true" : "false"}\nAnti nickname -> ${antiNickname ? "true" : "false"}`,/*\nAnti out -> ${dataAnti.antiout[threadID] ? "true" : "false"}*/
          threadID
        );
        break;
      }

      default: {
        return api.sendMessage(
          `The number you selected is not available in the command`,
          threadID
        );
      }
    }
  }
};

module.exports.run = async ({ api, event, args, permission, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  return api.sendMessage(
        `[ ANTI CONFIG SETTING ]\n────────────────\n1. Prevent group name change\n2. Prevent group image change\n3. Prevent nickname change\n4. Check box anti settings\n────────────────\n-> Reply with the number to select`,
        threadID, (error, info) => {
            if (error) {
              return api.sendMessage("An error occurred!", threadID);
            } else {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                permission
              });
            }
          });
};

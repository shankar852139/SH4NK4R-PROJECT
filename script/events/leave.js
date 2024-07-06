const axios = require("axios");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "MrTomXxX", // Mod by H.Thanh
  description: "Notify the Bot or the person leaving the group with a random gif/photo/video",
  dependencies: {
    "axios": "^1.6.2"
  }
};

module.exports.onLoad = function () {
  return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  const hours = moment.tz("Asia/Kolkata").format("HH");
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "खुद ही भाग गया😐👈" : "एडमिन ने गुस्से में निकाल दिया।😑👈";

  const gifUrls = [
    "https://i.imgur.com/hpCZF59.gif",
    "https://i.imgur.com/hArfbEv.gif",
    "https://i.imgur.com/dIkSLCv.gif",
    "https://i.imgur.com/EswO9hk.gif"
  ];

  const gifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

  let msg;
  if (typeof data.customLeave == "undefined") {
    msg = "सुकर है एक ठरकी इस ग्रुप में कम हो गया😑👈\nनाम👉 {name}\nरीजन👉 {type} \n हमारे साथ अपना कीमती समय देने के लिए धन्यवाद {name} जल्द ही फिर मिलेंगे😊💔\n\n[❤️‍🔥] बाय बाय खुश रहना हमेशा. {session} || {time} \n▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱ \n credit:-SHANKAR-SUMAN ";
  } else {
    msg = data.customLeave;
  }

  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type).replace(/\{session}/g, hours <= 10 ? "𝙈𝙤𝙧𝙣𝙞𝙣𝙜" : hours > 10 && hours <= 12 ? "𝘼𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣" : hours > 12 && hours <= 18 ? "𝙀𝙫𝙚𝙣𝙞𝙣𝙜" : "𝙉𝙞𝙜𝙝𝙩").replace(/\{time}/g, time);

  const response = await axios({
    url: gifUrl,
    method: "GET",
    responseType: "arraybuffer"
  });

  const formPush = { body: msg, attachment: response.data };

  return api.sendMessage(formPush, threadID);
}

module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermission: 0,
  credits: "SHANKAR",
  description: "Noprefix",
  commandCategory: "noPrefix",
  usePrefix: false,
  usages: "[]",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  var { threadID, messageID } = event;

  var maleReplies = ["अरे तु साइड हो मेको लड़कियों से बात करने दे"];
  var femaleReplies = ["हेल्लो मेरी जान कैसे हो बेबी"];

  let yan = event.body ? event.body.toLowerCase() : '';

  if (yan.indexOf("bot") >= 0 || yan.indexOf("tak") >= 0 || yan.indexOf("टकलू") >= 0) {
    console.log("Trigger word detected, proceeding...");

    api.setMessageReaction("🤖", event.messageID, (err) => {
      if (err) console.error("Error setting message reaction:", err);
    }, true);

    api.sendTypingIndicator(event.threadID, true);

    let userH = event.senderID;
    if (event.senderID == api.getCurrentUserID()) return;

    try {
      const userInfo = await Users.getUserInfo(userH);
      const userName = global.data.userName.get(userH) || userInfo.name;
      const userGender = userInfo.gender;

      console.log("User Info:", userInfo);

      let rand = userGender === 2 ? femaleReplies[Math.floor(Math.random() * femaleReplies.length)]
                                  : maleReplies[Math.floor(Math.random() * maleReplies.length)];

      var msg = {
        body: "@" + userName + ", " + rand,
        mentions: [{
          tag: "@" + userName,
          id: userH
        }]
      };

      setTimeout(function() {
        console.log("Sending message:", msg);
        api.sendMessage(msg, threadID, (err) => {
          if (err) console.error("Error sending message:", err);
          else console.log("Message sent successfully");
        });
      }, 100);
    } catch (err) {
      console.error("Error retrieving user info or sending message:", err);
    }
  } else {
    console.log("No trigger word found in message:", event.body);
  }
};

module.exports.run = async function ({ api, event, __GLOBAL }) {};

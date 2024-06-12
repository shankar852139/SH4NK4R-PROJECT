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
  var { threadID, messageID, senderID, body } = event;

  // Ignore messages from the bot itself
  if (senderID == api.getCurrentUserID()) return;

  // Check for trigger words in the message
  let yan = body ? body.toLowerCase() : '';

  if (yan.includes("bot") || yan.includes("tak") || yan.includes("टकलू")) {
    console.log("Trigger word detected, proceeding...");

    api.setMessageReaction("🤖", messageID, (err) => {
      if (err) console.error("Error setting message reaction:", err);
    }, true);

    api.sendTypingIndicator(threadID, true);

    let userName = "User"; // Default user name
    let userGender = 1; // Default gender (male)

    try {
      // Try to get user information from Users module
      const userInfo = await Users.getUserInfo(senderID);
      console.log("User Info Retrieved:", userInfo);
      if (userInfo && userInfo.name && userInfo.gender !== undefined) {
        userName = userInfo.name;
        userGender = userInfo.gender;
      }
    } catch (err) {
      console.error("Error retrieving user info:", err);
    }

    // Gender-specific responses
    var maleReplies = ["अरे तु साइड हो मेको लड़कियों से बात करने दे"];
    var femaleReplies = ["हेल्लो मेरी जान कैसे हो बेबी"];

    let rand = userGender === 2 ? femaleReplies[Math.floor(Math.random() * femaleReplies.length)]
                                : maleReplies[Math.floor(Math.random() * maleReplies.length)];

    var msg = {
      body: "@" + userName + ", " + rand,
      mentions: [{
        tag: "@" + userName,
        id: senderID
      }]
    };

    setTimeout(function() {
      console.log("Sending message:", msg);
      api.sendMessage(msg, threadID, (err) => {
        if (err) {
          console.error("Error sending message:", err);
        } else {
          console.log("Message sent successfully");
        }
      });
    }, 100);
  } else {
    console.log("No trigger word found in message:", body);
  }
};

module.exports.run = async function ({ api, event, __GLOBAL }) {};

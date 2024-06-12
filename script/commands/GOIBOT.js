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

module.exports.handleEvent = async function ({ api, event }) {
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

    // Send a simple response
    var msg = {
      body: "Hello! This is a test response."
    };

    setTimeout(function() {
      console.log("Sending message:", msg);
      api.sendMessage(msg, threadID, (err) => {
        if (err) {
          console.error("Error sending message:", err);
        } else {
          console.log("Test message sent successfully");
        }
      });
    }, 100);
  } else {
    console.log("No trigger word found in message:", body);
  }
};

module.exports.run = async function ({ api, event, __GLOBAL }) {};

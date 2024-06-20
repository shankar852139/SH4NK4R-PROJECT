module.exports.config = {
  name: "botgc",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR SUMAN",
  description: "Add user to specific group using command",
  commandCategory: "group",
  usePrefix: false,
  usages: "botgc",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const targetGroupID = "7955719797817768"; // Replace with the target group thread ID
  const userID = event.senderID; // The ID of the user who sent the command

  // Adding the user to the target group
  api.addUserToGroup(userID, targetGroupID, (err) => {
    if (err) {
      return api.sendMessage("Failed to add you to the group. Please try again later.", event.threadID, event.messageID);
    }
    return api.sendMessage("मैने आपको अपने ग्रुप👉 𝓡𝓸𝔂𝓪𝓵 𝓒𝓱𝓪𝓽𝓽𝓮𝓻𝓼 ✨💎 👈में एड कर दिया हूं जल्दी अपने मैसेज रिक्वेस्ट को चेक कर लो😍!", event.threadID, event.messageID);
  });
};

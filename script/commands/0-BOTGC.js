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
  const targetGroupID = "6970941769661211"; // Replace with the target group thread ID
  const userID = event.senderID; // The ID of the user who sent the command

  // Adding the user to the target group
  api.addUserToGroup(userID, targetGroupID, (err) => {
    if (err) {
      return api.sendMessage("Failed to add you to the group. Please try again later.", event.threadID, event.messageID);
    }
    return api.sendMessage("You have been added to the group!", event.threadID, event.messageID);
  });
};

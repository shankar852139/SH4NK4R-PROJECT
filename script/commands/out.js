module.exports.config = {
    name: "out",
    version: "1.0.0",
    hasPermission: 2,
    credits: "SHANKAR SUMAN",
    description: "Leave the group",
    usePrefix: false,
    commandCategory: "Admin",
    usages: "out",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args, Users }) {
    const leaveCommands = ["chal nikal", "chal bhag", "nikal", "out", "chal bhag yaha se", "taklu bhag jaa"];
    const command = event.body.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Get the user's ID who sent the command
    const userID = event.senderID;
    
    // Check if the user has the required permission
    const userInfo = await api.getUserInfo(userID);
    const isAdmin = userInfo[userID].isAdmin;

    if (!isAdmin) {
        return api.sendMessage("You do not have the required permissions to use this command.", event.threadID);
    }

    if (leaveCommands.some(cmd => command.includes(cmd))) {
        await api.sendMessage("जो आज्ञा मेरे मालिक😍", event.threadID);
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } else {
        return api.sendMessage("Invalid command. Use 'out' to leave the group.", event.threadID);
    }
}

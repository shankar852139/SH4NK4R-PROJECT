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
    
    // Define the user ID(s) allowed to use this command
    const allowedUserID = '100058415170590'; // Replace this with the actual user ID allowed to use the command

    // Get the user's ID who sent the command
    const userID = event.senderID;

    // Check if the user ID matches the allowed user ID
    if (userID !== allowedUserID) {
        return api.sendMessage("You do not have the required permissions to use this command.", event.threadID);
    }

    if (leaveCommands.some(cmd => command.includes(cmd))) {
        await api.sendMessage("जो आज्ञा मेरे मालिक😍", event.threadID);
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } else {
        return api.sendMessage("Invalid command. Use 'out' to leave the group.", event.threadID);
    }
}

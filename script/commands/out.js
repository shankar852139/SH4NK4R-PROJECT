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

module.exports.run = async function({ api, event, args }) {
    const leaveCommands = ["chal nikal", "chal bhag", "nikal", "out", "chal bhag yaha se", "taklu bhag jaa"];
    const command = event.body.toLowerCase().replace(/\s+/g, ' ').trim();
    if (leaveCommands.includes(command)) {
        await api.sendMessage("जो आज्ञा मेरे मालिक😍", event.threadID);
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } else {
        return api.sendMessage("Invalid command. Use 'out' to leave the group.", event.threadID);
    }
}

module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "manhIT",
	description: "Restart the Bot",
	commandCategory: "system",
  usePrefix: false,
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`दो मिनट रुको बॉस रिस्टार्ट हो रहा है...`, threadID, () => process.exit(1));
}

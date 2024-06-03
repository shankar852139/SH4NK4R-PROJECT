module.exports.config = {
	name: "skbot",
	version: "1.0.0",
	hasPermission: 0,
	credits: "SHANKAR SUMAN",
	description: "Bot Greet",
	commandCategory: "No Prefix",
	cooldowns: 5,
};
const fs = require("fs");
module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
var { threadID, messageID } = event;
const cron = require("node-cron")
cron.schedule('0 0 0 * * *', () => {
  api.getThreadList(30, null, ["INBOX"], (err, list) => {
loginApiData.sendMessage("Bot has been activated.", global.config.ADMINBOT[0]);
      //var cron = require("node-cron");
      const moment = require("moment-timezone");
      cron.schedule(`0 0 */1 * * *`, () => {
var o = moment.tz("Asia/Kolkata").format("MM/DD/YYYY");
  loginApiData.changeBio(`Prefix: ${global.config.PREFIX}\n\nBot Name: ${global.config.BOTNAME}\nBot Owner: ${global.config.OWNER}`);
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
}); 
      var tet = global.config.ADMINBOT;
cron.schedule(`0 0 */24 * * *`, () => {
  for (let pep of tet)
  loginApiData.sendMessage("AUTO RESTART TO AVOID BEING OFF", pep,() => process.exit(1));
},{
  scheduled: true,
  timezone: "Asia/Kolkata"
});

}
module.exports.run = function({ api, event, client, __GLOBAL }) {

                                       }

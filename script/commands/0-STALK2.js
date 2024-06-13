var cred = "SHANKAR";

module.exports.config = {
    name: "stalk",
    version: "1.0.0",
    hasPermision: 0,
    credits: `${cred}`,
    description: "get info using uid/mention/reply to a message",
    usages: "[reply/uid/@mention/url]",
    commandCategory: "info",
    cooldowns: 0,
};

module.exports.run = async function({api, event, args, utils, Users, Threads}) {
    try {
        // Check if credits have been changed
        if (module.exports.config.credits !== cred) {
            return api.sendMessage(`Credits have been changed from ${cred}.`, event.threadID, event.messageID);
        }

        let axios = require('axios');
        let fs = require("fs-extra");
        let request = require("request");
        let {threadID, senderID, messageID} = event;

        let id;
        if (args.join().indexOf('@') !== -1) {
            id = Object.keys(event.mentions);
        } else {
            id = args[0] || event.senderID;
        }

        if(event.type == "message_reply") {
            id = event.messageReply.senderID;
        } else if (args.join().indexOf(".com/") !== -1) {
            const res = await axios.get(`https://api.reikomods.repl.co/sus/fuid?link=${args.join(" ")}`);
            id = res.data.result;
        }

        let userInfo = await api.getUserInfo(id);
        let name = userInfo[id].name;
        let username = userInfo[id].vanity == "Không Xác Định" ? "Not Found" : userInfo[id].vanity;
        let url = userInfo[id].profileUrl;

        // Fetch additional information
        const userDetails = await axios.get(`https://graph.facebook.com/${id}?fields=birthday,gender,location,hometown&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
        let gender = userDetails.data.gender ? userDetails.data.gender.charAt(0).toUpperCase() + userDetails.data.gender.slice(1) : "Not Found";
        let birthday = userDetails.data.birthday ? userDetails.data.birthday : "Not Found";
        let location = userDetails.data.location ? userDetails.data.location.name : "Not Found";
        let hometown = userDetails.data.hometown ? userDetails.data.hometown.name : "Not Found";

        let callback = function() {
            return api.sendMessage({
                body: `•——[INFORMATION]——•\n\nName: ${name}\nFacebook URL: https://facebook.com/${username}\nUID: ${id}\nGender: ${gender}\nBirthday: ${birthday}\nLocation: ${location}\nHometown: ${hometown}\n\n•——[INFORMATION]——•`,
                attachment: fs.createReadStream(__dirname + `/cache/image.png`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/image.png`), event.messageID);
        };

        return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + `/cache/image.png`)).on("close", callback);
    } catch (err) {
        console.log(err);
        return api.sendMessage(`Error`, event.threadID);
    }
}

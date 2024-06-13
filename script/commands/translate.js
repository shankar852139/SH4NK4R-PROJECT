module.exports.config = {
    name: "trans",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SHANKAR",
    description: "Translate text to another language",
    commandCategory: "translator",
    usages: "[Text]",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const request = global.nodemodule["request"];
    var content = args.join(" ");
    if (content.length == 0 && event.type != "message_reply") return global.utils.throwError(this.config.name, event.threadID, event.messageID);
    
    var translateThis;
    var lang;
    
    if (event.type == "message_reply") {
        translateThis = event.messageReply.body;
        if (content.indexOf("-> ") !== -1) {
            lang = content.substring(content.indexOf("-> ") + 3);
        } else {
            lang = 'hi'; // Default language set to Hindi
        }
    } else {
        if (content.indexOf(" -> ") == -1) {
            translateThis = content;
            lang = 'hi'; // Default language set to Hindi
        } else {
            translateThis = content.slice(0, content.indexOf(" ->"));
            lang = content.substring(content.indexOf(" -> ") + 4);
        }
    }

    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
        if (err) return api.sendMessage("Error in translation", event.threadID, event.messageID);
        var retrieve = JSON.parse(body);
        var text = '';
        retrieve[0].forEach(item => {
            if (item[0]) text += item[0];
        });
        var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
        api.sendMessage(`Translation: ${text}\n - Translated from ${fromLang} to ${lang}`, event.threadID, event.messageID);
    });
};

const responses = {
    "😂": [
        "naam itni hasi q aa rahi iss hasi raaj batao",
        "naam itna mat has warna daant Tod dunga",
        "naam tumhe itna hasna pasand hai?",
        "naam ye hasi ka raaz kya hai?",
        "naam, tumhe hasi aayi? Mujhe bhi batao!"
    ],
    "😊": [
        "naam, tumhe kush dekh ke achha laga",
        "naam, tumhara muskuraana bahut suhana hai",
        "naam, aapka smile din bana deta hai",
        "naam, khush rehne ka shukriya",
        "naam, aapka muskurahat priceless hai"
    ],
    "😢": [
        "naam, kyun ro rahe ho?",
        "naam, kya hua jo tum ro rahe ho?",
        "naam, sab thik ho jayega",
        "naam, tumhe kisne rulaya?",
        "naam, rona band karo please"
    ],
    "😡": [
        "naam, gussa kyun ho?",
        "naam, araam se!",
        "naam, aapka gussa samajh sakta hoon",
        "naam, gussa thoda kam karo",
        "naam, thanda paani piyo aur relax karo"
    ],
    "😍": [
        "naam, kispe fida ho?",
        "naam, aapke dil mein kaun hai?",
        "naam, pyar ho gaya kya?",
        "naam, pyaar bhari nazar hai",
        "naam, dil se kehna chahta hoon, pyar mohabbat zindabad"
    ]
};

module.exports.config = {
    name: "autoReply",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: "Auto-reply to specific emojis",
    commandCategory: "No command marks needed",
    usePrefix: false,
    cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, client, Users, __GLOBAL }) {
    var { threadID, messageID, senderID, body } = event;
    const emojis = Object.keys(responses);

    for (const emoji of emojis) {
        if (body.includes(emoji)) {
            const userInfo = await api.getUserInfo(senderID);
            const userName = userInfo[senderID].name;

            // Randomly select a response from the appropriate array
            const randomResponse = responses[emoji][Math.floor(Math.random() * responses[emoji].length)];
            
            var msg = {
                body: randomResponse.replace("naam", userName),
            };
            api.sendMessage(msg, threadID, messageID);
            break;  // Exit the loop once a match is found
        }
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

}

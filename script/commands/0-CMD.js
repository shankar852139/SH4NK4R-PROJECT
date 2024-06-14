module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHANKAR SUMAN ",
    description: "Manage/Control all bot modules",
    commandCategory: "Admin",
    usePrefix: false,
    usages: "[load/unload/loadAll/unloadAll/install] [module name] [Pastebin URL]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": "",
        "axios": ""
    }
};

const fs = require("fs-extra");
const path = require("path");
const execSync = require("child_process").execSync;
const axios = require("axios");

module.exports.run = async function({ event, args, api }) {
    const { threadID, messageID } = event;

    if (args[0] === "install") {
        const moduleName = args[1];
        const pastebinURL = args[2];

        if (!moduleName || !pastebinURL) {
            return api.sendMessage("Module name and URL cannot be empty!", threadID, messageID);
        }

        const modulePath = path.join(__dirname, `${moduleName}.js`);

        try {
            const response = await axios.get(pastebinURL);
            const moduleCode = response.data;
            
            fs.writeFileSync(modulePath, moduleCode, "utf8");
            execSync(`npm install`, { stdio: "inherit" });

            return api.sendMessage(`Module ${moduleName} has been successfully installed!`, threadID, messageID);
        } catch (error) {
            return api.sendMessage(`Error installing module ${moduleName}: ${error.message}`, threadID, messageID);
        }
    } else {
        return api.sendMessage("Invalid command!", threadID, messageID);
    }
};

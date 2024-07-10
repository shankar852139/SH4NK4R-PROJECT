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

let loadedModules = {};

module.exports.run = async function({ event, args, api }) {
    const { threadID, messageID } = event;

    switch (args[0]) {
        case "install":
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
        case "load":
            const loadModuleName = args[1];

            if (!loadModuleName) {
                return api.sendMessage("Module name cannot be empty!", threadID, messageID);
            }

            const loadModulePath = path.join(__dirname, `${loadModuleName}.js`);

            if (!fs.existsSync(loadModulePath)) {
                return api.sendMessage(`Module ${loadModuleName} not found!`, threadID, messageID);
            }

            try {
                loadedModules[loadModuleName] = require(loadModulePath);
                return api.sendMessage(`Module ${loadModuleName} has been successfully loaded!`, threadID, messageID);
            } catch (error) {
                return api.sendMessage(`Error loading module ${loadModuleName}: ${error.message}`, threadID, messageID);
            }
        case "unload":
            const unloadModuleName = args[1];

            if (!unloadModuleName) {
                return api.sendMessage("Module name cannot be empty!", threadID, messageID);
            }

            if (!loadedModules[unloadModuleName]) {
                return api.sendMessage(`Module ${unloadModuleName} is not loaded!`, threadID, messageID);
            }

            delete loadedModules[unloadModuleName];
            return api.sendMessage(`Module ${unloadModuleName} has been successfully unloaded!`, threadID, messageID);
        case "loadAll":
            const modulesDir = path.join(__dirname, ".");
            const modules = fs.readdirSync(modulesDir);

            for (const module of modules) {
                if (module.endsWith(".js")) {
                    const moduleName = module.replace(".js", "");
                    try {
                        loadedModules[moduleName] = require(path.join(modulesDir, module));
                    } catch (error) {
                        console.error(`Error loading module ${moduleName}: ${error.message}`);
                    }
                }
            }

            return api.sendMessage("All modules have been successfully loaded!", threadID, messageID);
        case "unloadAll":
            loadedModules = {};
            return api.sendMessage("All modules have been successfully unloaded!", threadID, messageID);
        default:
            return api.sendMessage("Invalid command!", threadID, messageID);
    }
};

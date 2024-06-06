const chalk = require('chalk');
const gradient = require('gradient-string');

const gradientBold = gradient(['blue', 'green', 'white']).multiline;

module.exports = (data, option) => {
    switch (option) {
        case "warn":
            console.log(chalk.bold.hex("#FFA500")(gradientBold('[ Warning ] » \n') + data));
            break;
        case "error":
            console.log(chalk.bold.hex("#FF0000")(gradientBold('[ Error ] » \n') + data));
            break;
        default:
            var gradText = gradientBold(`${option} » \n${data}`);
            console.log(gradText);
            break;
    }
}

module.exports.loader = (data, option) => {
    switch (option) {
        case "success":
            console.log(chalk.bold.hex("#90EE90")(gradientBold('[ SHANKAR-PROJECT ] ❯ \n') + data));
            break;
        case "warn":
            console.log(chalk.bold.hex("#FFA500")(gradientBold('[ SHANKAR-PROJECT ] ❯ \n') + data));
            break;
        case "error":
            console.log(chalk.bold.hex("#FF0000")(gradientBold('[ SHANKAR-PROJECT ] ❯ \n') + data));
            break;
        default:
            var gradText = gradientBold(`[ SHANKAR-PROJECT ] ❯ \n${data}`);
            console.log(gradText);
            break;
    }
} 

const chalk = require("chalk");

class Logger {
  constructor() {}

  log(logMessage) {
    console.log(`[${chalk.green("LOG")}] : ${chalk.green(logMessage)}`);
  }

  warning(logMessage) {
    console.log(`[${chalk.yellow("WARNING")}] : ${chalk.yellow(logMessage)}`);
  }
  error(logMessage) {
    console.error(`[${chalk.red("ERROR")}] : ${chalk.red(logMessage)}`);
  }
}

module.exports = {
  Logger,
};

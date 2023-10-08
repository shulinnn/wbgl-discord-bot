const chalk = require("chalk");

class CustomError extends Error {
  constructor() {
    super();
    this.name = chalk.red("[" + EventNotFoundError.name + "]");
  }
}

module.exports = { CustomError };

const chalk = require("chalk");

module.exports = colors = {
    get RED() {
      return (text) => chalk.red(text);
    },
    get GREEN() {
      return (text) => chalk.green(text);
    },
    get BLUE() {
      return (text) => chalk.blue(text);
    },
    get YELLOW() {
      return (text) => chalk.yellow(text);
    },
    get MAGENTA() {
      return (text) => chalk.magenta(text);
    },
    get CYAN() {
      return (text) => chalk.cyan(text);
    },
    get WHITE() {
      return (text) => chalk.white(text);
    },
    get GRAY() {
      return (text) => chalk.gray(text);
    },
    get RESET() {
      return (text) => chalk.reset(text);
    },
  };
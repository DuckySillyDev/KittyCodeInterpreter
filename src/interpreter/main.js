// src\interpreter\main.js
// KittyCode Programming Language Interpreter By DuckySillyDev
// 0.1.0

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const chalk = require('chalk');

const colors = {
    get RED() { return (text) => chalk.red(text); },
    get GREEN() { return (text) => chalk.green(text); },
    get BLUE() { return (text) => chalk.blue(text); },
    get YELLOW() { return (text) => chalk.yellow(text); },
    get MAGENTA() { return (text) => chalk.magenta(text); },
    get CYAN() { return (text) => chalk.cyan(text); },
    get WHITE() { return (text) => chalk.white(text); },
    get GRAY() { return (text) => chalk.gray(text); },
    get RESET() { return (text) => chalk.reset(text); },
  };

const commander_program = new Command();
commander_program.requiredOption('--file <path>', 'File to interpret');
commander_program.requiredOption('--libarys <path>', 'Libarys directory');
commander_program.parse(process.argv);

const script_args = commander_program.opts(); 
const filePath = path.resolve(script_args.file); 
const libarysDirectory = path.resolve(script_args.libarys);

const functions = [
    {
        name: "log",
        args: [
            {
                name: "text",
                type: "string"
            }
        ],
        execution: (text) => {
            console.log(text.slice(0, -1));
        }
    },
    {
        name: "meow",
        args: [],
        execution: () => {
            while (true) {
                console.log("meow :3");
            }
        }
    },
    {
        name: "import",
        args: [
            {
                name: "package",
                type: "string"
            }
        ],
        execution: (text) => {
            console.log(text.slice(0, -1));
        }
    }
];

function getBetweenBrackets(text) {
    return text.split('(').slice(1).join(')').slice(1,-1).slice(0, -1); ;
}

function getBetweenQuotes(text) {
    return text.split('\'').slice(1).join('\'').slice(1,-1).slice(0, -1); ;
}

console.log(colors.GREEN("KittyCode Loaded - Version 0.1.0"));
console.log(colors.YELLOW("Libarys Directory Is: " + libarysDirectory));
console.log(colors.MAGENTA("---SCRIPT START---") + colors.RESET(""));

fs.access(filePath, fs.constants.R_OK, (err) => {
  if (err) {
    console.error(`${colors.YELLOW('[Interpreter]')} ${colors.RED('File cannot be read or does not exist.')}`);
    process.exit(1);
  } else {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`${colors.YELLOW('[Interpreter]')} ${colors.RED('Error reading file:')} ${err}`);
        process.exit(1);
      } else {
        interpretFile(data);
      }
    });
  }
});

function interpretFile(data) {
    const lines = data.split('\n');
    for (let lineLoopIndex = 0; lineLoopIndex < lines.length; lineLoopIndex++) {
        const line = lines[lineLoopIndex];
        interpretLine(line, lineLoopIndex);
    }
    console.log(colors.MAGENTA("---SCRIPT END---") + colors.RESET(""));
}

function interpretLine(line, lineNumber) {
    if (line.trim() === '') {
        return;
    }
    if (line.startsWith(';;')) {
        return;
    }

    for (let checkForFunctionCallLoopIndex = 0; checkForFunctionCallLoopIndex < functions.length; checkForFunctionCallLoopIndex++) {
        const functionNameToCheck = functions[checkForFunctionCallLoopIndex].name;
        if (line.startsWith(functionNameToCheck)) {
            const functionArgs = getBetweenBrackets(line).split(',');
            const functionExecution = functions[checkForFunctionCallLoopIndex].execution;
            functionExecution(...functionArgs);
            return;
        }
    }
}

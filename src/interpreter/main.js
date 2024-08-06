// src\interpreter\main.js
// KittyCode Programming Language Interpreter By DuckySillyDev
// 0.1.0

const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const chalk = require("chalk");

const colors = require("./modules/colors");

const commander_program = new Command();
commander_program.requiredOption("--file <path>", "File to interpret");
commander_program.requiredOption("--libarys <path>", "Libarys directory");
commander_program.option("--terminalInput", "Lets you type single lines into the terminal", false);
commander_program.parse(process.argv);

const script_args = commander_program.opts();
const filePath = path.resolve(script_args.file);
const libarysDirectory = path.resolve(script_args.libarys);

global.KittyCodeCoreFunctions = {
  log: (text) => {
    const lastChar = text[text.length - 1];
    if (lastChar === "'") {
      console.log(text.slice(0, -1));
    } else {
      console.log(text);
    }
  },
  meow: () => {
    while (true) {
      console.log("meow :3");
    }
  },
};

// shut the fuck up
process.on('uncaughtException', (error) => {
    console.log(`${colors.YELLOW("[Interpreter]")} ${colors.RED("Something went very terribly wrong. Unhandled interpreter error:")} ${error}`);
    process.exit(1);
})

const functions = [
  {
    name: "log",
    execution: KittyCodeCoreFunctions.log,
  },
  {
    name: "meow",
    execution: KittyCodeCoreFunctions.meow,
  },
  {
    name: "import",
    args: [
      {
        name: "package",
        type: "string",
      },
    ],
    execution: (packageName) =>
      new Promise((resolve, reject) => {
        const libarys = fs.readdirSync(libarysDirectory);
        for (let i = 0; i < libarys.length; i++) {
          libarys[i] = libarys[i].slice(0, -3);
        }
        packageName = packageName.slice(0, -1);
        if (libarys.includes(packageName)) {
          const libaryFunctions = require(path.join(
            libarysDirectory,
            packageName
          ));
          for (const libaryFunction of libaryFunctions) {
            const name = packageName + "." + libaryFunction.name;
            const wrappedExecution = (...args) => {
              return new Promise((innerResolve, innerReject) => {
                const result = libaryFunction.execution(...args);
                if (result instanceof Promise) {
                  result.then(innerResolve).catch(innerReject);
                } else {
                  innerResolve(result);
                }
              });
            };
            functions.push({
              name,
              execution: wrappedExecution,
            });
          }
          resolve();
        } else {
          reject(new Error("Library not found"));
        }
      }),
  },
];

function getBetweenBrackets(text) {
  return text.split("(").slice(1).join(")").slice(1, -1).slice(0, -1);
}

function getBetweenQuotes(text) {
  return text.split("'").slice(1).join("'").slice(1, -1).slice(0, -1);
}

console.log(colors.GREEN("KittyCode Loaded - Version 0.1.0"));
console.log(colors.YELLOW("Libarys Directory Is: " + libarysDirectory));
console.log(colors.MAGENTA("---SCRIPT START---") + colors.RESET(""));

if (script_args.terminalInput) {
  console.log(colors.CYAN("Type 'exit' to quit the interpreter."));

  const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line) => {
    if (line.trim() === "exit") {
      rl.close();
    } else {
      interpretLine(line);
    }
  });
}

fs.access(filePath, fs.constants.R_OK, (err) => {
  if (script_args.terminalInput) {
    return;
  }
  if (err) {
    console.error(
      `${colors.YELLOW("[Interpreter]")} ${colors.RED(
        "File cannot be read or does not exist."
      )}`
    );
    process.exit(1);
  } else {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(
          `${colors.YELLOW("[Interpreter]")} ${colors.RED(
            "Error reading file:"
          )} ${err}`
        );
        process.exit(1);
      } else {
        interpretFile(data);
      }
    });
  }
});

async function interpretFile(data) {
    const lines = data.split('\n');
    for (let lineLoopIndex = 0; lineLoopIndex < lines.length; lineLoopIndex++) {
        const line = lines[lineLoopIndex];
        await interpretLine(line, lineLoopIndex + 1);
    }
    console.log(colors.MAGENTA("---SCRIPT END---") + colors.RESET(""));
}

async function interpretLine(line, lineNumber) {
    if (line.trim() === '' || line.startsWith('//')) {
        return;
    }

    let foundValidFunction = false;

    for (let checkForFunctionCallLoopIndex = 0; checkForFunctionCallLoopIndex < functions.length; checkForFunctionCallLoopIndex++) {
        const functionNameToCheck = functions[checkForFunctionCallLoopIndex].name;
        if (line.startsWith(functionNameToCheck + "(")) {
            foundValidFunction = true;
            const functionArgs = getBetweenBrackets(line).split(',').map(arg => arg.trim());
            const functionExecution = functions[checkForFunctionCallLoopIndex].execution;
            await functionExecution(...functionArgs);
            return;
        }
    }

    if (!foundValidFunction) {
        console.error(`${colors.YELLOW('[Interpreter]')} ${colors.RED('Function not found')} - ${colors.RED('Line:')} ${colors.CYAN(lineNumber)}`);
        process.exit(1);
    }
}

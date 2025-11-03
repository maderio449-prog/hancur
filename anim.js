// bot_anim.js
const chalk = require("chalk"); // npm install chalk
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const frames = [
    chalk.cyan("B"),
    chalk.cyan("BO"),
    chalk.cyanBright("BOT"),
    chalk.blueBright("BOT 🤖"),
    chalk.magentaBright("BOT ⚡"),
    chalk.yellowBright("BOT 💫"),
    chalk.greenBright("BOT ✨"),
  ];

  console.clear();
  for (const f of frames) {
    console.clear();
    console.log(f);
    await sleep(300); // jeda 0.3 detik antar frame
  }

  console.clear();
  console.log(chalk.bold.cyan(`
██████╗  ██████╗ ████████╗
██╔══██╗██╔═══██╗╚══██╔══╝
██████╔╝██║   ██║   ██║   
██╔══██╗██║   ██║   ██║   
██████╔╝╚██████╔╝   ██║   
╚═════╝  ╚═════╝    ╚═╝   
`));
  console.log(chalk.yellowBright("\n⚡ Lawliet Bot by Rifat ⚡"));
})();

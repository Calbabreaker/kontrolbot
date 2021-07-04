require("dotenv").config();
const childProcess = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    console.log("Bot running!");
});

client.on("message", (msg) => {
    const trimmedMsg = msg.content.trim();
    if (trimmedMsg[0] != ">") return;

    const fmtMsg = trimmedMsg.slice(1, trimmedMsg.length);
    childProcess.exec(fmtMsg, (error, stdout, stderr) => {
        let output = "";

        if (error) output = error;
        else if (stderr) output = stderr;
        else if (stdout) output = stdout;

        if (output != "") output = `\`${output}\``;

        msg.channel.send(`Result of \`${fmtMsg}\`:\n${output}`);
    });
});

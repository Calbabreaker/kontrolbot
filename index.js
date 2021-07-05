require("dotenv").config();
const childProcess = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

const botCommandDeliminator = "!kontrolbot";

client.on("ready", () => {
    console.log("Bot running!");
});

client.on("message", (messageObj) => {
    const trimmedMessage = messageObj.content.trim();
    if (trimmedMessage[0] === ">") {
        doShellCommand(messageObj.channel, trimmedMessage.slice(1, trimmedMessage.length));
    } else if (trimmedMessage.startsWith(botCommandDeliminator)) {
        doBotCommand(
            messageObj.channel,
            trimmedMessage.slice(botCommandDeliminator.length, trimmedMessage.length).trim()
        );
    }
});

let subProcess;
let smbInterval;

function doShellCommand(channel, shellCommand) {
    if (subProcess != null) {
        channel.send(
            `Process \`${subProcess.command}\` is already running! \nType !kontrolbot kill to kill it.`
        );
        return;
    }

    subProcess = childProcess.spawn(shellCommand, { shell: true });
    subProcess.command = shellCommand;
    channel.send(`Running \`${subProcess.command}\`...`);

    subProcess.stdout.on("data", (data) => {
        queueMessage(data.toString());
    });

    subProcess.stderr.on("data", (data) => {
        queueMessage(data.toString());
    });

    clearMessageBuffer();
    smbInterval = setInterval(() => {
        sendMessageBuffer(channel);
    }, 500);

    subProcess.on("exit", () => {
        subProcess = null;
    });
}

// bot commands begin with !kontrolbot
function doBotCommand(channel, botCommand) {
    switch (botCommand) {
        case "kill":
            if (subProcess != null) {
                channel.send(`Killed \`${subProcess.command}\``);
                subProcess.kill();
                clearMessageBuffer();
            } else {
                channel.send(`No process is running!`);
            }
            break;
        default:
            channel.send(`Invalid kontrol bot command: \`${botCommand}\``);
            break;
    }
}

const messageLimit = 2000;
let messageBuffer = "";

function queueMessage(message) {
    messageBuffer += message;
}

function sendMessageBuffer(channel) {
    let messageToSend = messageBuffer;
    if (messageBuffer.length > messageLimit) {
        messageToSend = messageBuffer.slice(0, messageLimit);
        let nextLineBreakI = messageToSend.lastIndexOf("\n");
        if (nextLineBreakI !== -1) messageToSend = messageToSend.slice(0, nextLineBreakI + 1);
    }

    if (messageToSend.trim() === "") {
        if (subProcess == null) clearMessageBuffer();
        return;
    }

    channel.send(messageToSend);
    messageBuffer = messageBuffer.slice(messageToSend.length - 1, messageBuffer.length);
}

function clearMessageBuffer() {
    clearInterval(smbInterval);
    messageBuffer = "";
}

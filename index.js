"use strict";

const botCommandDelm = "!kb";
const messageLimit = 2000;

require("dotenv").config();
const childProcess = require("child_process");
const Discord = require("discord.js");
const client = new Discord.Client();

// a dictionary with usernames and value boolean
// if a user doesn't exist then it would be false
let allowedUsers = {};
let allowAll = false;

// owners can make other users be allowed to run kontrolbot
// owners can only be modified by modifying .env and restarting kontrolbot
let owners = {};
if (process.env.OWNERS) {
    process.env.OWNERS.split(",").forEach((name) => {
        owners[name] = true;
        allowedUsers[name] = true;
    });
} else {
    allowAll = true;
}

client.on("ready", () => {
    console.log("Bot running!");
});

client.on("message", (message) => {
    const trimmedMessage = message.content.trim();
    if (trimmedMessage[0] === ">") {
        if (!checkAllowed(message)) return;

        doShellCommand(message.channel, trimmedMessage.slice(1, trimmedMessage.length));
    } else if (trimmedMessage.startsWith(botCommandDelm)) {
        if (!checkAllowed(message)) return;

        const removedDelm = trimmedMessage
            .slice(botCommandDelm.length, trimmedMessage.length)
            .trim();
        doBotCommand(message, removedDelm);
    }
});

client.login(process.env.BOT_TOKEN);

let subProcess;
let smbInterval;

function doShellCommand(channel, shellCommand) {
    if (subProcess != null) {
        subProcess.stdin.write(shellCommand + "\n");
        return;
    }

    subProcess = childProcess.spawn(shellCommand, {
        shell: true,
        windowsHide: true,
    });

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
function doBotCommand(message, botCommand) {
    const args = botCommand.split(/ +/g);
    switch (args[0]) {
        case "kill":
            if (subProcess != null) {
                message.channel.send(`Killed \`${subProcess.command}\`.`);
                subProcess.kill();
                clearMessageBuffer();
            } else {
                message.channel.send(`No process is running!`);
            }
            break;
        case "allow":
            if (!checkOwner(message)) break;

            if (!allowedUsers[args[1]]) {
                if (args[1] == "*") {
                    allowAll = true;
                    message.channel.send(`Made everyone allowed to use kontrol bot.`);
                    break;
                }

                message.channel.send(`Made ${args[1]} allowed to use kontrol bot.`);
                allowedUsers[args[1]] = true;
            } else {
                message.channel.send(`${args[1]} was already allowed to use kontrol bot!`);
            }
            break;
        case "disallow":
            if (!checkOwner(message)) break;

            if (args[1] == "*") {
                message.channel.send(`Made all non owners disallowed from using kontrol bot.`);
                resetAllowedUsers();
                break;
            }

            if (allowAll) {
                message.channel.send(
                    `Cannot disallow someone if everyone is allowed! Use * to disallow everyone.`
                );
                break;
            }

            if (allowedUsers[args[1]]) {
                if (owners[args[1]]) {
                    message.channel.send(`Cannot disallow ${args[1]} because they are an owner!`);
                    break;
                }

                message.channel.send(`Made ${args[1]} disallowed from using kontrol bot.`);
                allowedUsers[args[1]] = false;
            } else {
                message.channel.send(`${args[1]} was already disallowed from kontrol bot!`);
            }
            break;
        default:
            message.channel.send(`Invalid kontrol bot command: \`${botCommand}\``);
            break;
    }
}

function checkAllowed(message) {
    if (!allowedUsers[message.author.tag] && !allowAll) {
        message.channel.send(
            `${message.author.tag} is not allowed to use kontrol bot! ` +
                `Owners can allow by typing \`${botCommandDelm} allow ${message.author.tag}\``
        );
        return false;
    }

    return true;
}

function checkOwner(message) {
    if (!owners[message.author.tag]) {
        message.channel.send(
            `${message.author.tag} is not an owner so they cannot allow or disallow other users from using kontrol bot!`
        );
        return false;
    }

    return true;
}

function resetAllowedUsers() {
    allowAll = false;
    Object.keys(owners).forEach((name) => {
        allowedUsers[name] = true;
    });
}

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

    const sanitizedMessage = messageToSend.replace(
        /[A-Za-z\d]{22,24}\.[\w-]{4,6}\.[\w-]{25,27}/g,
        ""
    );

    channel.send(sanitizedMessage);
    messageBuffer = messageBuffer.slice(messageToSend.length - 1, messageBuffer.length);
}

function clearMessageBuffer() {
    clearInterval(smbInterval);
    messageBuffer = "";
}

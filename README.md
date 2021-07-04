# Kontrol Bot

A discord bot that can control your computer through the shell.

## Setup

Go to the [applications control
panel](https://discord.com/developers/applications), create an application,
then make a bot, then copy the token and create a .env file with `BOT_TOKEN=put
bot token here` as its contents. Then go to
`http://discord.com/oauth2/authorize?client_id=APP_ID&scope=bot` with APP_ID
being the application id to add it to a server.

You can run it directly on your computer by running `yarn install` to install
dependencies and `yarn start` to start it.

A better way is to run inside a docker container with `docker run --env-file
.env --rm -it -t calbabreaker/kontrolbot` .

## Usage

Type a message with `>` at the front and it will execute the message and echo
back the result.  Note that it has to finish the command in order for it to
echo back.

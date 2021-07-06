# Kontrol Bot

A discord bot that can control your computer through the shell.

## Setup

Go to the [applications control
panel](https://discord.com/developers/applications), create an application,
then make a bot, then create a .env file with `BOT_TOKEN=put
bot token here` as its contents. Then go to Then go to
`http://discord.com/oauth2/authorize?client_id=APP_ID&scope=bot` with APP_ID
being the application id to add it to a server.

You can run it directly on your computer by running `yarn install` to install
dependencies and `yarn start` to start it.

Or run it inside a docker container with `yarn start:docker -t
calbabreaker/kontrolbot`. You can also build a docker image with `yarn
build:docker` and run the image with the same run command but with
calbabreaker/kontrolbot replaced with the built image tag.

## Usage

Type a message with `>` at the front and it will execute the message and echo
back the result. Commands will continuously send back their output until the
commmand finishes. You can use `!kb kill` to kill the current command.




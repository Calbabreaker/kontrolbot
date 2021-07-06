# Kontrol Bot

A discord bot that controls your computer through the shell.

Works on Linux, MacOS, Windows, etc.

## Setup

#### Getting the bot 

Go to the [applications control
panel](https://discord.com/developers/applications), create an application,
then make a bot, then create a .env file with `BOT_TOKEN=put bot token here` as
its contents. Then go to Then go to
`http://discord.com/oauth2/authorize?client_id=APP_ID&scope=bot` with APP_ID
being the application id to add it to a server.

#### Running it

Make sure you have [nodejs](https://nodejs.org/) and
[yarn](https://yarnpkg.com/) installed.  Get the source code and run `yarn
install` at the root dir.

Now you can run it directly on your computer by running `yarn start`.

Or run it inside a docker container with `yarn start:docker -t
calbabreaker/kontrolbot`. You can also build a docker image with `yarn
build:docker` and run the image with the same run command but with
calbabreaker/kontrolbot replaced with the built image tag.

## Usage

Type a message with `>` at the front and it will execute the message and echo
back the result. Commands will continuously send back their output until the
commmand finishes. You can use `!kb kill` to kill the current command.

By default everyone can use kontrol bot but if you wan't to restrict usage,
then first put `OWNERS=` in on seperate line and add your username#tag or
anyone you trust as a comma seperated list to the left of the =.

Example .env:

```
BOT_TOKEN=000000000000000.0000.00000000000000000
OWNERS=User#1013,AmazingUser#2184
```

Now only the specified OWNERS can use kontrol bot. If you want others to use it
then type `!kb allow username#tag` to allow them. You can disallow them by
doing `!kb disallow username#tag`. You can also allow or disallow everyone
access by have the username#tag as `*`.

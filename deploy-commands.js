require("dotenv").config()
require("./config").config()

const { Collection } = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { GUILD_ID, CLIENT_ID, BOT_TOKEN } = require("./config.json")

const fakeClient = {commands: new Collection()};
require("./command_registry").registerCommands(fakeClient);
const commands = fakeClient.commands.map(cmd => cmd.data.toJSON());

const rest = new REST({version: '9'}).setToken(BOT_TOKEN);
rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
  .then(() => console.log("Registered application commands."))
  .catch(console.error)
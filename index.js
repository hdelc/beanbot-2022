require("dotenv").config()
require("./config").config()

const Discord = require("discord.js");
const config = require("./config.json");
const otherFile = require("./otherFile")

const client = new Discord.Client({intents: Discord.Intents.FLAGS.GUILDS})
client.commands = new Discord.Collection();
require("./command_registry").registerCommands(client);

client.on("interactionCreate", (interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    command.execute(interaction);
  } catch (err) {
    console.error(err);
  }
}));

client.login(config.BOT_TOKEN)
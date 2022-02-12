const fs = require('fs')

module.exports = {
  registerCommands: (client) => {
    const commandFiles = fs.readdirSync("./commands").filter(name => name.endsWith(".js"));
    commandFiles.forEach(file => {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    });
  }
}
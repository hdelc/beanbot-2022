const fs = require('fs')

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID
}

module.exports.config = () => fs.writeFileSync("./config.json", JSON.stringify(config));
const { SlashCommandBuilder } = require('@discordjs/builders')
const paths = require("../paths")
const Table = require("table-builder")
const fs = require('fs')

const supportedFileTypes = [["HTML", "html"], ["JSON", "json"]];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compilefeedback")
    .setDescription("Assembles project feedback all in one place")
    .addStringOption(option => option.setName("project")
      .setDescription("Project name")
      .setRequired(true))
    .addStringOption(option => option.setName("filetype")
      .setDescription("The type of file you want (html or json)")
      .addChoices(supportedFileTypes)
      .setRequired(true)),
  async execute(interaction) {
    const validRegex = /^[\w- ]{0,32}/;
    const projectName = interaction.options.getString("project");
    const fileType = interaction.options.getString("filetype");
    if (!projectName.match(validRegex)) {
      interaction.reply({
        content: `Invalid project name: \`${projectName}\``,
        ephemeral: true});
      return;
    }
    if (!fs.existsSync(`${paths.projectDir(interaction.user.id, projectName)}`)) {
      interaction.reply({
        content: `\`${projectName}\` does not exist.`,
        ephemeral: true});
      return;
    }
    let data = JSON.parse(fs.readFileSync(paths.projectFeedback(interaction.user.id, projectName),
      err => {if(err) throw err;})).feedback;

    let path = "";
    let fileString = "";
    switch (fileType) {
      case "json":
        fileString = JSON.stringify(data, null, 2);
        path = "./save/data.json";
        break;
      case "html":
        const headers = {
          guild: "Guild ID",
          user_tag: "User Tag",
          feedback: "Feedback",
          stars: "Stars"
        }
        fileString = new Table()
          .setHeaders(headers)
          .setData(data)
          .render().toString();
        path = "./save/data.html";
        break;
      default:
        interaction.reply({
          content: `\'.${fileType}\' is not supported`,
          ephemeral: true});
        return;
    }
    fs.writeFileSync(path, fileString, err => {if(err) throw err;})
    interaction.reply({
      files: [path],
      ephemeral: true
    })
    
    
  }
}


const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { findSourceMap } = require('module')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("project")
    .setDescription("Command for project management")
    .addSubcommand(sc => sc.setName("create")
      .setDescription("Create a new project")
      .addStringOption(option => option.setName("name")
        .setDescription("The name of the project to be created")
      )
    )
    .addSubcommand(sc => sc.setName("delete")
      .setDescription("Deletes a given project")
      .addStringOption(option => option.setName("name")
        .setDescription("The name of the project to be deleted")
      )
    )
    .addSubcommand(sc => sc.setName("list")
      .setDescription("Displays your projects")
    )
    ,
  async execute(interaction) {
    const safeUsername = interaction.user.tag.replace("#", "_");
    const validRegex = /^[\w-]{0,32}/;
    const userDir = `./save/${safeUsername}`;
    const projectName = interaction.options.getString("name");
    switch (interaction.options.getSubcommand()) {
      case "create":
        if (!projectName.match(validRegex)) {
          interaction.reply({
            content: `Invalid project name: \`${projectName}\``,
            ephemeral: true});
          return;
        }
        if (fs.existsSync(`${userDir}/${projectName}${extension}`)) {
          interaction.reply({
            content: `\`${projectName}\` already exists. You can delete it with \"/project delete ${projectName}\"`,
            ephemeral: true});
          return;
        }
        if (!fs.existsSync(userDir)) 
          await fs.mkdir(userDir, {recursive: true}, err => {if (err) throw err;});
          fs.writeFile(`${userDir}/${projectName}${extension}`,
            projectLabels.join(","),
            err => {if (err) throw err;});
            interaction.reply({
              content: `\`${projectName}\` was created.`,
              ephemeral: true});
        break;
      case "delete":
        if (!projectName.match(validRegex)) {
          interaction.reply({
            content: `Invalid project name: \`${projectName}\``,
            ephemeral: true});
          return;
        }
        if (!fs.existsSync(`${userDir}/${projectName}${extension}`)) {
          interaction.reply({
            content: `\`${projectName}\` does not exist`,
            ephemeral: true});
          return;
        }
        fs.rm(`${userDir}/${projectName}${extension}`, err => {if (err) throw err;});
        interaction.reply({
          content: `\`${projectName}\` was deleted.`,
          ephemeral: true});
        break;
      case "list":
        let projects = []
        if (fs.existsSync(`${userDir}`))
          projects = fs.readdirSync(`${userDir}`);
        const embed = new MessageEmbed()
          .setTitle("Your projects:")
          .setDescription(projects.join("\n"));
        interaction.reply({embeds: [embed], ephemeral: true});
        break;
    }
  }
}

const projectLabels = ["server", "user", "feedback", "rating"]
const extension = ".csv"
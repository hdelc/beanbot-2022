const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const paths = require("../paths")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { BOT_TOKEN } = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listing")
    .setDescription("Manage project listings on a server")
    .addSubcommand(sc => sc.setName("post")
      .setDescription("Post a project listing on this server")
      .addStringOption(option => option.setName("project")
        .setDescription("The name of the project to be posted")
        .setRequired(true))
      .addStringOption(option => option.setName("listing")
        .setDescription("The name of the listing for your project (project name by default)")))
    .addSubcommand(sc => sc.setName("remove")
      .setDescription("Remove a project listing on this server")
      .addStringOption(option => option.setName("listing")
        .setDescription("The name of the listing to be removed")
        .setRequired(true)))
    .addSubcommand(sc => sc.setName("list")
      .setDescription("Shows a list of all the project listings on this server"))
    .addSubcommand(sc => sc.setName("view")
      .setDescription("View a listing on this server")
      .addStringOption(option => option.setName("listing")
        .setDescription("The name of the listing to be viewed")
        .setRequired(true))
      .addBooleanOption(option => option.setName("visible")
        .setDescription("Whether other people can see the listing (default: True)"))),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "The \`/listing\` command may only be performed in a server.",
        ephemeral: true});
      return;
    }
    const validRegex = /^[\w- ]{0,32}/;
    const serverListingsFile = paths.listingFile(interaction.guildId);
    if (!fs.existsSync(serverListingsFile)) initializeServerListings(serverListingsFile);
    const listings = JSON.parse(fs.readFileSync(serverListingsFile, err => {if(err) throw err;})
      .toString());
    let listingName = "";

    switch (interaction.options.getSubcommand()) {
      case "post":
        let projectName = interaction.options.getString("project");
        listingName = interaction.options.getString("alias");
        if (!listingName) listingName = projectName;
        if (!listingName.match(validRegex)) {
          interaction.reply({
            content: `Invalid listing name: \`${projectName}\``,
            ephemeral: true});
          return;
        }
        if(listingName in listings) {
          interaction.reply({
            content: `Listing ${listingName} already exists on this server`,
            ephemeral: true
          });
          return;
        }
        if(!fs.existsSync(paths.projectDir(interaction.user.id, projectName))) {
          interaction.reply({
            content: `Project \`${projectName}\` does not exist.`,
            ephemeral: true
          });
          return;
        }
        const projectMeta = JSON.parse(fs.readFileSync(
          paths.projectMeta(interaction.user.id, projectName), 
          err => {if(err) throw err;})
          .toString());
        listings[listingName] = {
          owner: interaction.user.id, 
          project: projectName, 
          link: projectMeta.link,
          description: projectMeta.description
        };
        fs.writeFileSync(serverListingsFile, JSON.stringify(listings), err => {if(err) throw err;});
        const postEmbed = await createListingEmbed(listingName, projectMeta);
        interaction.reply({
          embeds: [postEmbed]
        })
        break;
      case "remove":
        listingName = interaction.options.getString("listing");
        if(!(listingName in listings)) {
          interaction.reply({
            content: `Listing ${listingName} does not exist on this server`,
            ephemeral: true
          });
          return;
        }
        if(interaction.user.id != listings[listingName].owner &&
            !interaction.memberPermissions.has(8192)) {
          interaction.reply({
            content: `You do not have permission to remove \`${listingName}\``,
            ephemeral: true
          });
          return;
        }
        delete listings[listingName];
        fs.writeFileSync(serverListingsFile, JSON.stringify(listings), err => {if(err) throw err;});
        interaction.reply({
          content: `Listing \`${listingName}\` removed from this server`,
          ephemeral: true
        })
        break;
      case "list":
        const listEmbed = new MessageEmbed()
          .setTitle("Project listings:")
          .setDescription(Object.keys(listings).join("\n"));
        interaction.reply({embeds: [listEmbed], ephemeral: true});
        break;
      case "view":
        listingName = interaction.options.getString("listing");
        let visible = interaction.options.getBoolean("visible");
        if (visible === null) visible = true;
        if (!(listingName in listings)) {
          interaction.reply({
            content: `Listing ${listingName} does not exist on this server`,
            ephemeral: true
          });
          return;
        }
        const listing = listings[listingName];
        if (!fs.existsSync(paths.projectMeta(listing.owner, listing.project))) {
          interaction.reply({
            content: `Listing ${listingName}'s project no longer exists. Deleting...`,
            ephemeral: true
          });
          delete listings[listingName];
          fs.writeFileSync(serverListingsFile,
            JSON.stringify(listings),
            err => {if(err) throw err;});
          return;
        }
        const listingEmbed = await createListingEmbed(listingName, listing);
        interaction.reply({embeds: [listingEmbed], ephemeral: !visible});
        break;
    }
  }
}

function initializeServerListings(path) {
  fs.writeFileSync(path, JSON.stringify({ }), err => {if(err) throw err;});
}

async function createListingEmbed(listingName, meta) {
  const rest = new REST({version: '9'}).setToken(BOT_TOKEN);
  const user = await rest.get(Routes.user(meta.owner));
  return listingEmbed = new MessageEmbed()
          .setTitle(listingName)
          .setDescription(meta.description)
          .setAuthor({
            name: `${user.username}#${user.discriminator}`, 
            iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`})
          .setURL(meta.link);
}
const fs = require('fs')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const paths = require("../paths")
const { BOT_TOKEN } = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givefeedback")
    .setDescription("Command for giving feedback on listings")
    .addStringOption(option => option.setName("listing")
      .setDescription("The name of the listing to give feedback to")
      .setRequired(true))
    .addStringOption(option => option.setName("feedback")
      .setDescription("Written feedback"))
    .addIntegerOption(option => option.setName("stars")
      .setDescription("Star-rating from 1 to 5")
      .setMinValue(1)
      .setMaxValue(5))
    .addBooleanOption(option => option.setName("visible")
      .setDescription("Whether the feedback is visible (default: True)")),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "The \`/listing\` command may only be performed in a server.",
        ephemeral: true});
      return;
    }
    const validRegex = /^[\w- ]{0,32}/;
    let listingName = interaction.options.getString("listing");
    const feedback = interaction.options.getString("feedback");
    const stars = interaction.options.getInteger("stars");
    let visible = interaction.options.getBoolean("visible");
    if (visible === null) visible = true;
    if (!listingName.match(validRegex)) {
      interaction.reply({
        content: `Invalid listing name: \`${projectName}\``,
        ephemeral: true});
      return;
    }
    const serverListings = JSON.parse(fs.readFileSync(
      paths.listingFile(interaction.guildId), 
      err => {if(err) throw err;})
      .toString()
    );
    if (!(listingName in serverListings)) {
      interaction.reply({
        content: `Listing ${listingName} does not exist on this server`,
        ephemeral: true
      });
      return;
    }
    const listing = serverListings[listingName]

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

    if (feedback === null && stars === null) {
      interaction.reply({
        content: "No feedback received. Try using the \`feedback\` or \`stars\` options",
        ephemeral: true
      });
      return;
    }

    const projectFeedback = JSON.parse(fs.readFileSync(
      paths.projectFeedback(listing.owner, listing.project), 
      err => {if(err) throw err;})
      .toString()
    );
    const feedbackObject = {
      guild: interaction.guildId,
      user_tag: interaction.user.tag,
      feedback: feedback,
      stars: stars
    };
    projectFeedback.feedback.push(feedbackObject)
    const newObj = {
      feedback: projectFeedback.feedback,
      entries: projectFeedback.entries + 1
    }
    

    fs.writeFileSync(paths.projectFeedback(listing.owner, listing.project),
      JSON.stringify(newObj),
      err => {if(err) throw err;});
    
    const ratingLine = "Stars:     " + ((stars !== null) ? `${stars} / 5` : "N/A");
    const feedbackLine = "Feedback:  " + ((feedback !== null) ? feedback : "N/A");
    feedbackEmbed = new MessageEmbed()
      .setTitle(`${listingName} Feedback`)
      .setDescription(`${ratingLine}\n${feedbackLine}`)
      .setAuthor({
        name: interaction.user.tag, 
        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`});
    interaction.reply({
      embeds: [feedbackEmbed],
      ephemeral: !visible
    });
  }
}
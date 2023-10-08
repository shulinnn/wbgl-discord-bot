const { EmbedBuilder } = require("discord.js");

function CreateEventStartEmbedMessage(dataObject) {
  const EventStartEmbedMessage = new EmbedBuilder()
    .setAuthor({
      name: "WBGL Bot",
      iconURL:
        "https://cdn.discordapp.com/ephemeral-attachments/1146578669515583518/1149346552230445147/0_3.png",
    })
    .setTitle("Event start")
    .setDescription(
      `<@&${dataObject.player_role_id.toString()}> <@&${dataObject.organizer_role_id.toString()}> \nThe event has been started !`
    )
    .setImage(dataObject.banner)
    .setThumbnail(dataObject.banner);

  return EventStartEmbedMessage;
}

module.exports = {
  CreateEventStartEmbedMessage,
};

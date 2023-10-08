const { SlashCommandBuilder } = require("discord.js");
const {
  JoinEventCommandOptions,
} = require("$/command-options/JoinEventCommandOptions.js");

const {
  EventAlreadyStartedError,
} = require("$/errors/EventAlreadyStartedError");

const { EventNotFoundError } = require("$/errors/EventNotFoundError");
const { EventAlreadyJoinedError } = require("$/errors/EventAlreadyJoinedError");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-event")
    .setDescription("Join the event")
    .addStringOption((option) =>
      option.setName("event-name").setDescription("Name of the event")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const joinEventCommandOptions = new JoinEventCommandOptions(interaction);

    await joinEventCommandOptions.setEvent();

    if (!joinEventCommandOptions.doesExist())
      throw new EventNotFoundError(interaction);

    if (joinEventCommandOptions.isLive())
      throw new EventAlreadyStartedError(interaction);

    if (await joinEventCommandOptions.didIJoin())
      throw new EventAlreadyJoinedError(interaction);

    await joinEventCommandOptions.addPlayer();
    await joinEventCommandOptions.assignRole();

    interaction.editReply({
      content: "Successfully joined event.",
      ephemeral: true,
    });
  },
};

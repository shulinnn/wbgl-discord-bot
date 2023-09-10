const { PrismaClient } = require("@prisma/client");
const { SlashCommandBuilder } = require("discord.js");
const { GetRolesForEvent } = require("../../utils/GetRoleForEvent");
const {
  DidItStart,
  GetEventStartTime,
} = require("../../utils/HasEventStarted");
const {
  EventAlreadyStartedError,
  EventNotFoundError,
  EventAlreadyJoinedError,
} = require("../../utils/messages/errors");
const { JoinEventCommandOptions } = require("../../utils/utils");

const prisma = new PrismaClient();

async function DoesEventExist(eventName) {
  const res = await prisma.event.findFirst({
    where: {
      name: eventName,
    },
  });

  if (res == null) return false;
  else return true;
}

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

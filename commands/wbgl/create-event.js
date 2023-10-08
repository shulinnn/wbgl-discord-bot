const {
  EventType,
  PrismaClient,
  EventAvailability,
} = require("@prisma/client");
const { SlashCommandBuilder } = require("discord.js");
const { handleEventCreate } = require("$/utils/handleEventCreate");
const { ToIsoDateString } = require("$/utils/utils");

const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-event")
    .setDescription("Create WBGL Event")
    .addStringOption((option) =>
      option.setName("event-name").setDescription("Name of the event")
    )
    .addStringOption((option) =>
      option
        .setName("event-type")
        .setDescription("Choose type of the event")
        .addChoices(
          { name: "Metting", value: EventType.Meeting },
          { name: "League", value: EventType.League },
          { name: "Tournament", value: EventType.Tournament }
        )
    )
    .addAttachmentOption((option) =>
      option.setName("event-banner").setDescription("Banner of the event")
    )
    .addStringOption((option) =>
      option
        .setName("event-player-role-color")
        .setDescription(
          "Player role color for the event , accepts only HEX values"
        )
    )
    .addStringOption((option) =>
      option
        .setName("event-organizer-role-color")
        .setDescription(
          "Player role color for the event , accepts only HEX values"
        )
    )
    .addStringOption((option) =>
      option
        .setName("event-availability")
        .setDescription("Decide the availability of the event")
        .setChoices(
          { name: "Public", value: EventAvailability.Public },
          { name: "Private", value: EventAvailability.Private }
        )
    )
    .addStringOption((option) =>
      option.setName("event-start").setDescription("When will the event start.")
    ),
  async execute(interaction) {
    /// create db event -> create some sort of notifications for users that event was created.
    await prisma.event
      .create({
        data: {
          name: interaction.options.getString("event-name"),
          banner: interaction.options.getAttachment("event-banner").attachment,
          event_type: interaction.options.getString("event-type"),
          event_availability:
            interaction.options.getString("event-availability"),
          start_at: ToIsoDateString(
            interaction.options.getString("event-start")
          ),
          player_role_color: interaction.options.getString(
            "event-player-role-color"
          ),
          organizer_role_color: interaction.options.getString(
            "event-organizer-role-color"
          ),
          organizer: {
            connect: {
              discord_id: parseInt(interaction.user.id),
            },
          },
        },
      })
      .catch((e) => {
        ///most probably we fucked up -> send reply
        interaction.reply({
          content: "Something went wrong.",
          ephemeral: true,
        });
        console.error(e);
      })
      .then(async (e) => {
        interaction.deferReply({ ephemeral: true });
        ///Probably only prisma return the db result => remove later
        await handleEventCreate(interaction);
      });
  },
};

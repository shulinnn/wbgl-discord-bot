const { PrismaClient, EventStatus } = require("@prisma/client");
const { SlashCommandBuilder } = require("discord.js");

const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel-event")
    .setDescription("Cancel event (only if u're organizer)")
    .addStringOption((option) =>
      option.setName("event-name").setDescription("Name of the event")
    ),
  async execute(interaction) {
    /// Check if the event with this name exists and interaction.user.id === discordId of organizer

    await interaction.deferReply();

    await prisma.event
      .findFirst({
        where: {
          name: interaction.options.getString("event-name"),
          organizer: {
            discord_id: parseInt(interaction.user.id),
          },
        },
      })
      .then(async (res) => {
        if (res == null) {
          ///havent found record  =>
          interaction.editReply({
            content: `Event not found OR you're not the event organizer.`,
            ephemeral: true,
          });
        } else {
          await prisma.event.update({
            where: {
              name: interaction.options.getString("event-name"),
              organizer: {
                discord_id: parseInt(interaction.user.id),
              },
            },
            data: {
              event_status: EventStatus.Cancelled,
            },
          });
        }
      });
  },
};

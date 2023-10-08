const { EventType, PrismaClient } = require("@prisma/client");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { CreateLeagueEmbedMessage } = require("./LeagueEmbedMessage");

const prisma = new PrismaClient();

async function handleEventCreate(interaction) {
  /// for easy access we will create guildManager here

  const wbglGuild = interaction.client.guilds.cache.get(process.env.server_id);

  if (!wbglGuild.available)
    console.log(
      "Somewthing is wrong, our guild is not available.Probably server outage ?"
    );

  ///here we should create roles for participant and organizer

  const organizerRole = await wbglGuild.roles
    .create({
      name: `${interaction.options.getString("event-name")} organizer`,
      color: interaction.options.getString("event-organizer-role-color"),
    })
    .catch(console.error);

  const playerRole = await wbglGuild.roles
    .create({
      name: `${interaction.options.getString("event-name")} participant`,
      color: interaction.options.getString("event-player-role-color"),
    })
    .catch(console.error);

  await prisma.event
    .update({
      where: {
        name: interaction.options.getString("event-name"),
      },
      data: {
        organizer_role_id: organizerRole.id,
        player_role_id: playerRole.id,
        organizer: {
          connect: {
            discord_id: parseInt(interaction.user.id),
          },
        },
      },
    })
    .then(async (e) => {
      const roles = await GetRolesForEvent(
        interaction.options.getString("event-name")
      );

      interaction.member.roles.add(roles.organizer);
    })
    .catch(console.error);

  // store roleId inside db..
  switch (interaction.options.getString("event-type")) {
    case EventType.League:
      {
        wbglGuild.channels
          .create({
            name: interaction.options.getString("event-name"),
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: wbglGuild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: playerRole.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: organizerRole.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          })
          .then(async (channel) => {
            await prisma.event.update({
              where: {
                name: interaction.options.getString("event-name"),
              },
              data: {
                channel_category_id: channel.id,
              },
            });
            wbglGuild.channels
              .create({
                name: interaction.options.getString("event-name"),
                type: ChannelType.GuildText,
                parent: channel,
              })
              .then(async (channel) => {
                await prisma.event.update({
                  where: {
                    name: interaction.options.getString("event-name"),
                  },
                  data: {
                    channel_id: channel.id,
                  },
                });
              })
              .catch(console.error);
          })
          .catch(console.error);
      }
      break;

    default:
      break;
  }

  if (IsEventPublic(interaction)) {
    // send embed
    await interaction.editReply({
      embeds: [CreateLeagueEmbedMessage(interaction)],
    });
  } else {
    await interaction.editReply({
      content: "We do not support private events yet.",
      ephemeral: true,
    });
  }
}

module.exports = {
  handleEventCreate,
};

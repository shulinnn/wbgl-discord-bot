const { MatchType, Map, PrismaClient, Race } = require("@prisma/client");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const {
  MatchSamePlayersError,
  MatchChannelCreationError,
  MatchCreateError,
  ChannelCategoryNotFoundError,
  MatchFetchPlayersError,
  EventNotFoundError,
} = require("../../utils/messages/errors");
const { RandomRaceGenerator } = require("../../utils/RandomRaceGen");
const {
  BigIntToNumber,
  CreateMatchCommandOptions,
} = require("../../utils/utils");

const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-match")
    .setDescription("Creates match for an event")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option.setName("player1").setDescription("Player 1")
    )
    .addUserOption((option) =>
      option.setName("player2").setDescription("Player 2")
    )
    .addStringOption((option) =>
      option.setName("map").setDescription("Choose map").addChoices(
        {
          name: Map.Map1,
          value: Map.Map1,
        },
        {
          name: Map.Map2,
          value: Map.Map2,
        },
        {
          name: Map.Map3,
          value: Map.Map3,
        }
      )
    )
    .addStringOption((option) =>
      option.setName("match-type").setDescription("Match type").addChoices({
        name: MatchType.BO1,
        value: MatchType.BO1,
      })
    )
    .addStringOption((option) =>
      option.setName("match-event").setDescription("event of the match")
    )
    .addBooleanOption((option) =>
      option.setName("races-boolean").setDescription("Are races pre-defined ?")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const createMatchCommandOptions = new CreateMatchCommandOptions()
      .setMap(interaction.options.getString("map"))
      .setMatchType(interaction.options.getString("match-type"))
      .setRacesBool(interaction.options.getBoolean("races-boolean"))
      .setPlayers({
        player1: interaction.options.getUser("player1"),
        player2: interaction.options.getUser("player2"),
      });

    createMatchCommandOptions.setEvent(
      await prisma.event.findFirst({
        where: {
          name: interaction.options.getString("match-event"),
        },
      })
    );

    if (createMatchCommandOptions.event === null)
      throw new EventNotFoundError(interaction);

    if (
      createMatchCommandOptions.players.player1 ===
      createMatchCommandOptions.players.player2
    )
      throw new MatchSamePlayersError(interaction);

    createMatchCommandOptions.setPlayers(
      await prisma.user.findMany({
        where: {
          username: {
            in: [
              interaction.options.getUser("player1").username,
              interaction.options.getUser("player2").username,
            ],
          },
        },
        select: {
          username: true,
          id: true,
        },
      })
    );

    if (createMatchCommandOptions.players === null)
      throw new MatchFetchPlayersError(interaction);

    if (createMatchCommandOptions.racesBool)
      createMatchCommandOptions.setRaces(await RandomRaceGenerator());
    else createMatchCommandOptions.setRaces([Race.TBA, Race.TBA]);

    createMatchCommandOptions.setChannelCategory(
      interaction.guild.channels.cache.find(
        (e) =>
          e.id ==
          BigIntToNumber(createMatchCommandOptions.event.channel_category_id)
      )
    );

    if (createMatchCommandOptions.channelCategory === null || undefined)
      throw new ChannelCategoryNotFoundError(interaction);

    createMatchCommandOptions.setChannel(
      await interaction.guild.channels.create({
        name: `${createMatchCommandOptions.players[0].username} VS ${createMatchCommandOptions.players[1].username}`,
        type: ChannelType.GuildText,
        parent: createMatchCommandOptions.channelCategory,
        permissionOverwrite: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: parseInt(createMatchCommandOptions.players[0].discord_id),
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: parseInt(createMatchCommandOptions.players[1].discord_id),
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
      })
    );

    if (createMatchCommandOptions.channel === null || undefined)
      throw new MatchChannelCreationError(interaction);

    const match = await prisma.match
      .create({
        data: {
          players: {
            connect: [
              {
                id: createMatchCommandOptions.players[0].id,
              },
              {
                id: createMatchCommandOptions.players[1].id,
              },
            ],
          },
          races: createMatchCommandOptions.races,
          channel_id: createMatchCommandOptions.channel.id,
          score: [0, 0],
          match_type: createMatchCommandOptions.matchType,
          Event: {
            connect: {
              id: createMatchCommandOptions.event.id,
            },
          },
          map: createMatchCommandOptions.map,
        },
      })
      .then((e) =>
        interaction.editReply({
          content: "Match successfully created",
          ephemeral: true,
        })
      )
      .catch((e) => {
        throw new MatchCreateError(interaction);
      });
  },
};

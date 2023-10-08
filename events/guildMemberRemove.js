const { Events } = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const { Logger } = require("$/utils/logger");

const prisma = new PrismaClient();
const logger = new Logger();

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(interaction) {
    if (interaction.user.bot) return;

    await prisma.user
      .delete({
        where: {
          discord_id: parseInt(interaction.user.id),
        },
      })
      .then(logger.log(`Deleted member => ${interaction.user.username}`))
      .catch((e) => logger.error(e));
  },
};

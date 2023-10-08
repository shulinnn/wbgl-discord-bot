const { PrismaClient } = require("@prisma/client");
const { Logger } = require("../logger");

const prisma = new PrismaClient();
const logger = new Logger();

class CancelEventCommandOptions {
  constructor(interaction) {
    this.event = null;
    this.interaction = interaction;
  }

  async setEvent() {
    this.event = await prisma.event.findFirst({
      where: {
        name: this.interaction.options.getString("event-name"),
        organizer: {
          discord_id: parseInt(this.interaction.user.id),
        },
      },
    });
  }
  doesExist() {
    if (this.event === null) return false;
    else return true;
  }

  async cancelEvent() {
    await prisma.event
      .update({
        where: {
          name: interaction.options.getString("event-name"),
          organizer: {
            discord_id: parseInt(interaction.user.id),
          },
        },
        data: {
          event_status: EventStatus.Cancelled,
        },
      })
      .then((e) => logger.log(e))
      .catch((e) => logger.error(e));
  }
}

module.exports = {
  CancelEventCommandOptions,
};

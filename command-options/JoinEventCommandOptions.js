const { PrismaClient, EventAvailability } = require("@prisma/client");
const { Logger } = require("$/utils/logger");
const { EventNotFoundError } = require("$/errors/EventNotFoundError");

const prisma = new PrismaClient();
const logger = new Logger();

class JoinEventCommandOptions {
  constructor(interaction) {
    this.event = null;
    this.interaction = interaction;
  }

  async setEvent() {
    this.event = await prisma.event.findFirst({
      where: {
        name: this.interaction.options.getString("event-name"),
      },
    });
    console.log(this.event);
    if (this.event === null) throw new EventNotFoundError(this.interaction);
  }

  isLive() {
    if (Date.now() > this.event.start_at) return true;
    else return false;
  }

  isPublic() {
    if (this.event.event_availability === EventAvailability.Public) return true;
    else return false;
  }

  doesExist() {
    if (this.event == null) return false;
    else return true;
  }

  async didIJoin() {
    const res = await prisma.event.findFirst({
      where: {
        players: {
          some: {
            discord_id: parseInt(this.interaction.user.id),
          },
        },
      },
    });
    if (res === null) return false;
    else return true;
  }

  async addPlayer() {
    await prisma.event
      .update({
        where: {
          name: this.event.name,
        },
        data: {
          players: {
            connect: {
              discord_id: parseInt(this.interaction.user.id),
            },
          },
        },
      })
      .then(
        logger.log(
          `User ${this.interaction.user.username} successfully joined event.`
        )
      )
      .catch((e) => logger.error(e));
  }

  async assignRole() {
    this.interaction.member.roles.add(this.event.player_role_id);
  }
}

module.exports = { JoinEventCommandOptions };

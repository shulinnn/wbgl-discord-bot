const { Events } = require("discord.js");
const { Logger } = require("$/utils/logger");
const { PrismaClient, EventStatus } = require("@prisma/client");

const prisma = new PrismaClient();
const logger = new Logger();

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.log(`Ready! Logged in as ${client.user.tag}`);
    logger.log("Looking for new server members...");
    const members = await client.guilds.cache
      .get(process.env.server_id)
      .members.fetch();
    members.forEach(async (member) => {
      if (member.user.bot) return;
      await prisma.user
        .upsert({
          where: {
            discord_id: parseInt(member.user.id),
          },
          update: {},
          create: {
            discord_id: parseInt(member.user.id),
            username: member.user.username,
          },
        })
        .catch((e) => logger.error(e))
        .then(logger.log(`Updated member => ${member.user.username}`));
    });
    setInterval(async function () {
      const scheduledEvents = await GetAllEvents();

      const currDate = new Date();
      currDate.setHours(currDate.getHours() + 2);

      /// this will probably work but could create some unexpected scenarios:D

      const timesTillEvent = [];

      scheduledEvents.forEach((event) => {
        const validEvent = moment(currDate).diff(
          moment(event.start_at),
          "minutes",
          false
        );

        /// If event start in 10 minutes we should care about him
        if (Math.sign(validEvent) === -1 && validEvent >= -1) {
          timesTillEvent.push({
            id: event.id,
            name: event.name,
            start_at: event.start_at,
            diff: validEvent,
            channel_id: event.channel_id,
          });
        }
      });

      if (Object.entries(timesTillEvent).length > 0)
        console.log(timesTillEvent);

      timesTillEvent.forEach((event) => {
        HandleEventStart(event, client);
      });
    }, 5000);
  },
};

async function GetAllEvents() {
  return await prisma.event
    .findMany({
      where: {
        event_status: EventStatus.Scheduled,
      },
    })
    .catch(console.error);
}

const { PrismaClient, EventStatus } = require("@prisma/client");
const { CreateEventStartEmbedMessage } = require("./EventStartEmbedMessage");

const prisma = new PrismaClient();

async function HandleEventStart(eventObject, client) {
  /// change event status

  await prisma.event
    .update({
      where: {
        id: eventObject.id,
      },
      data: {
        event_status: EventStatus.Ongoing,
      },
    })
    .catch(console.error);

  const event = await prisma.event
    .findFirst({
      where: {
        id: eventObject.id,
      },
    })
    .catch(console.error);

  ///what else should event start do ?
  /// 1. Send some sort of message that event has started

  const guild = await client.guilds.fetch(process.env.server_id);
  ///console.log(guild);

  ///console.log(guild.channels);

  const eventChannelCollection = await guild.channels.cache.find(
    (e) => e.id === event.channel_id.toString()
  );
  ///console.log(eventChannel);

  const eventObjectData = await prisma.event.findFirst({
    where: {
      id: eventObject.id,
    },
  });

  const embed = CreateEventStartEmbedMessage(eventObjectData);

  eventChannelCollection.send({ embeds: [embed] });
}

module.exports = {
  HandleEventStart,
};

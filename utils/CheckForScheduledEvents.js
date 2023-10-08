const { PrismaClient, EventStatus } = require("@prisma/client");
const moment = require("moment");
const { HandleEventStart } = require("./HandleEventStart");

const prisma = new PrismaClient();

async function GetAllEvents() {
  return await prisma.event
    .findMany({
      where: {
        event_status: EventStatus.Scheduled,
      },
    })
    .catch(console.error);
}

async function CheckForScheduledEvents(client) {
  const scheduledEvents = await GetAllEvents();

  const currDate = new Date();
  currDate.setHours(currDate.getHours() + 2);

  /// this will probably work but could create some unexpected scenario:D

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

  if (Object.entries(timesTillEvent).length > 0) console.log(timesTillEvent);

  timesTillEvent.forEach((event) => {
    HandleEventStart(event, client);
  });

  /* 
  if (Math.sign(timeTillEvent) == -1) {
    console.log(`${timeTillEvent} minutes till ${e.name} start`);
    if (timeTillEvent >= -1) {
      HandleEventStart(e, client);
    }
  } else {
    console.log("No events scheduled");
  } */
}

module.exports = {
  CheckForScheduledEvents,
};

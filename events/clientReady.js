const { Events } = require("discord.js");
const { UpdateAllUsersOrUpdateAll } = require("../utils/UpdateAllUsersOrUpdateAll");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Looking for new server members...`);
    const members = await client.guilds.cache.get(process.env.server_id).members.fetch()
    await UpdateAllUsersOrUpdateAll(members);
  },
};

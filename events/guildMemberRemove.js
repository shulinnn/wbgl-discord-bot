const { Events } = require("discord.js");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();  

module.exports = {
    name : Events.GuildMemberRemove,
    async execute(interaction) {
        if(interaction.user.bot) return;
        
        await prisma.user.delete({
            where: {
                discord_id : parseInt(interaction.user.id)
            }
        }).catch(console.error).then(`Deleted member => ${interaction.user.username}`)
    }
}
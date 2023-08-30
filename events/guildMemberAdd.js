const { Events } = require("discord.js");
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();  

module.exports = {
    name : Events.GuildMemberAdd,
    async execute(interaction) {
        if(interaction.user.bot) return;
        
        await prisma.user.upsert({
            where:{
                discord_id : parseInt(interaction.user.id)
            },
            update : {
                discord_id : parseInt(interaction.user.id),
                username : interaction.user.username
            },
            create: {
                discord_id : parseInt(interaction.user.id),
                username : interaction.user.username
            }
        }).catch(console.error).then(console.log(`Updated new(old) member => ${interaction.user.username}`))

    }
}
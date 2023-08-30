const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();  

async function UpdateAllUsersOrUpdateAll (members) {

    members.forEach(async (member) => {
        if(member.user.bot) return;
        await prisma.user.upsert({
            where: {
                discord_id : parseInt(member.user.id)
            },
            update:{},
            create:{
                discord_id : parseInt(member.user.id),
                username : member.user.username,
            }
        }).catch(console.error).then(console.log(`Updated new member => ${member.user.username}`))
    })
}

module.exports = { UpdateAllUsersOrUpdateAll }
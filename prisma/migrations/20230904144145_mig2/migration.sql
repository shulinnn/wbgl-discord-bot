-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Scheduled', 'Ongoing', 'Cancelled');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "event_status" "EventStatus" NOT NULL DEFAULT 'Scheduled';

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "human" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
    "orc" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
    "undead" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
    "night_elf" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

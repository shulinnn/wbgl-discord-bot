/*
  Warnings:

  - Added the required column `event_availability` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizer_role_color` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_role_color` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventAvailability" AS ENUM ('Private', 'Public');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "event_availability" "EventAvailability" NOT NULL,
ADD COLUMN     "organizer_role_color" INTEGER NOT NULL,
ADD COLUMN     "player_role_color" INTEGER NOT NULL;

/*
  Warnings:

  - Added the required column `channel_id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "channel_category_id" BIGINT,
ADD COLUMN     "channel_id" BIGINT,
ADD COLUMN     "organizer_role_id" BIGINT,
ADD COLUMN     "player_role_id" BIGINT;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "channel_id" BIGINT NOT NULL;

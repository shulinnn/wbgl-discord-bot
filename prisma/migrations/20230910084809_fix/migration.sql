/*
  Warnings:

  - Added the required column `map` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "map" "Map" NOT NULL;

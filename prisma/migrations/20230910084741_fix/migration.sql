/*
  Warnings:

  - The values [BO2,BO3,BO4,BO5] on the enum `MatchType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `map` on the `Match` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MatchType_new" AS ENUM ('BO1');
ALTER TABLE "Match" ALTER COLUMN "match_type" TYPE "MatchType_new" USING ("match_type"::text::"MatchType_new");
ALTER TYPE "MatchType" RENAME TO "MatchType_old";
ALTER TYPE "MatchType_new" RENAME TO "MatchType";
DROP TYPE "MatchType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "map";

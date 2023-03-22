/*
  Warnings:

  - You are about to drop the column `aiGenerated` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `aiGenerated`,
    ADD COLUMN `isAIGenerated` BOOLEAN NOT NULL DEFAULT false;

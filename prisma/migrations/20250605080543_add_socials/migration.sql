/*
  Warnings:

  - Added the required column `text` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "text" TEXT NOT NULL;

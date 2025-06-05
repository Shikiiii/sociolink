/*
  Warnings:

  - Added the required column `order` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "order" INTEGER NOT NULL;

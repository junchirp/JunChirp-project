/*
  Warnings:

  - Added the required column `role` to the `developers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "developers" ADD COLUMN     "role" TEXT NOT NULL;

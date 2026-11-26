-- CreateEnum
CREATE TYPE "PreparationTaskStatus" AS ENUM ('OPEN', 'DONE');

-- CreateTable
CREATE TABLE "PreparationTask" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PreparationTaskStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreparationTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreparationTask_carId_status_idx" ON "PreparationTask"("carId", "status");

-- AddForeignKey
ALTER TABLE "PreparationTask" ADD CONSTRAINT "PreparationTask_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

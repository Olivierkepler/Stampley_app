-- CreateTable
CREATE TABLE "CheckInSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "subscale" TEXT NOT NULL,
    "distress" INTEGER NOT NULL,
    "mood" INTEGER,
    "energy" INTEGER,
    "reflection" TEXT NOT NULL,
    "copingAction" TEXT,
    "contextTags" JSONB NOT NULL,
    "needsSafetyEscalation" BOOLEAN NOT NULL DEFAULT false,
    "previousDayDistress" INTEGER,
    "consecutiveHighDistressDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckInSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckInSubmission" ADD CONSTRAINT "CheckInSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

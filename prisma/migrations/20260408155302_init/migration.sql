-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectType" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "riskNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "riskCategory" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Risk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "joinCode" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lockedAt" DATETIME,
    "facilitatorName" TEXT NOT NULL,
    "facilitatorToken" TEXT NOT NULL,
    CONSTRAINT "Session_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "participantToken" TEXT NOT NULL,
    "anonToken" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionRisk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "riskNumber" INTEGER NOT NULL,
    "included" BOOLEAN NOT NULL,
    CONSTRAINT "SessionRisk_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SessionRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "sessionRiskId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "impact" INTEGER,
    "likelihood" INTEGER,
    "abstained" BOOLEAN NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_sessionRiskId_fkey" FOREIGN KEY ("sessionRiskId") REFERENCES "SessionRisk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrescreenVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "sessionRiskId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "include" BOOLEAN NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrescreenVote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PrescreenVote_sessionRiskId_fkey" FOREIGN KEY ("sessionRiskId") REFERENCES "SessionRisk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "sessionRiskId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "causeTrigger" TEXT,
    "timeHorizon" TEXT,
    "mitigationStrategy" TEXT NOT NULL,
    "currentControls" TEXT,
    "controlEffectiveness" TEXT,
    "mitigationActions" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "residualImpact" INTEGER,
    "residualLikelihood" INTEGER,
    "earlyWarningIndicators" TEXT,
    CONSTRAINT "RiskAssignment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RiskAssignment_sessionRiskId_fkey" FOREIGN KEY ("sessionRiskId") REFERENCES "SessionRisk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LTDecision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "riskAssignmentId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "decisionDate" DATETIME NOT NULL,
    "decisionOwner" TEXT NOT NULL,
    "nextReviewDate" DATETIME,
    "notes" TEXT,
    CONSTRAINT "LTDecision_riskAssignmentId_fkey" FOREIGN KEY ("riskAssignmentId") REFERENCES "RiskAssignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Snapshot_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "projectId" TEXT,
    "action" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "actorId" TEXT,
    "metadata" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_joinCode_key" ON "Session"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_sessionId_participantToken_key" ON "Participant"("sessionId", "participantToken");

-- CreateIndex
CREATE UNIQUE INDEX "SessionRisk_sessionId_riskId_key" ON "SessionRisk"("sessionId", "riskId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_sessionRiskId_tokenHash_key" ON "Vote"("sessionRiskId", "tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PrescreenVote_sessionRiskId_tokenHash_key" ON "PrescreenVote"("sessionRiskId", "tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssignment_sessionId_sessionRiskId_key" ON "RiskAssignment"("sessionId", "sessionRiskId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_sessionId_version_key" ON "Snapshot"("sessionId", "version");

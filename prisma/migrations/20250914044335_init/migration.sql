-- CreateEnum
CREATE TYPE "public"."City" AS ENUM ('Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('Apartment', 'Villa', 'Plot', 'Office', 'Retail');

-- CreateEnum
CREATE TYPE "public"."BHK" AS ENUM ('Studio', '1', '2', '3', '4');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('Buy', 'Rent');

-- CreateEnum
CREATE TYPE "public"."Timeline" AS ENUM ('0-3m', '3-6m', '>6m', 'Exploring');

-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('Website', 'Referral', 'Walk-in', 'Call', 'Other');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."buyers" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(15) NOT NULL,
    "city" "public"."City" NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "bhk" "public"."BHK",
    "purpose" "public"."Purpose" NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timeline" "public"."Timeline" NOT NULL,
    "source" "public"."Source" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'New',
    "notes" VARCHAR(1000),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."buyer_history" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diff" JSONB NOT NULL,

    CONSTRAINT "buyer_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "buyers_ownerId_status_updatedAt_idx" ON "public"."buyers"("ownerId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "buyers_ownerId_city_propertyType_idx" ON "public"."buyers"("ownerId", "city", "propertyType");

-- CreateIndex
CREATE INDEX "buyers_phone_idx" ON "public"."buyers"("phone");

-- CreateIndex
CREATE INDEX "buyers_email_idx" ON "public"."buyers"("email");

-- CreateIndex
CREATE INDEX "buyers_updatedAt_idx" ON "public"."buyers"("updatedAt");

-- CreateIndex
CREATE INDEX "buyer_history_buyerId_changedAt_idx" ON "public"."buyer_history"("buyerId", "changedAt");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buyers" ADD CONSTRAINT "buyers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buyer_history" ADD CONSTRAINT "buyer_history_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."buyers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."buyer_history" ADD CONSTRAINT "buyer_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "rollnumber" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "subjectName" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "teacher_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_sessions" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_sessions" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_rollnumber_key" ON "students"("rollnumber");

-- CreateIndex
CREATE INDEX "students_email_idx" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_rollnumber_idx" ON "students"("rollnumber");

-- CreateIndex
CREATE INDEX "students_standard_division_idx" ON "students"("standard", "division");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "subjects_standard_division_idx" ON "subjects"("standard", "division");

-- CreateIndex
CREATE INDEX "subjects_subjectName_idx" ON "subjects"("subjectName");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subjectName_standard_division_key" ON "subjects"("subjectName", "standard", "division");

-- CreateIndex
CREATE INDEX "student_sessions_student_id_idx" ON "student_sessions"("student_id");

-- CreateIndex
CREATE INDEX "student_sessions_token_idx" ON "student_sessions"("token");

-- CreateIndex
CREATE INDEX "teacher_sessions_teacher_id_idx" ON "teacher_sessions"("teacher_id");

-- CreateIndex
CREATE INDEX "teacher_sessions_token_idx" ON "teacher_sessions"("token");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_sessions" ADD CONSTRAINT "teacher_sessions_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

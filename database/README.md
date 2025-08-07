# Database Setup for DeafSo Backend

This directory contains all the database-related files for the DeafSo backend application using PostgreSQL with Supabase.

## 📁 Files Overview

### SQL Files
- **`postgres_schema.sql`** - Complete PostgreSQL schema with tables, indexes, triggers, and constraints

## 🚀 Quick Setup

### Option 1: Using Prisma (Recommended)
```bash
# Generate Prisma client and push schema
npm run db:init

# Seed the database
npm run db:seed
```

### Option 2: Using Raw SQL
```bash
# Initialize database with SQL files
npm run db:init-postgres
```

### Option 3: Manual SQL Execution
1. Connect to your Supabase PostgreSQL database
2. Execute `postgres_schema.sql` to create tables
3. Execute `sample_data.sql` to insert sample data

## 📊 Database Schema

### Tables Created

#### 1. **students**
- `id` - Primary key (SERIAL)
- `fullname` - Student's full name
- `email` - Unique email address
- `mobile` - Phone number
- `password` - Hashed password
- `standard` - Class/grade level
- `division` - Class division (A, B, C, etc.)
- `rollnumber` - Unique roll number
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

#### 2. **teachers**
- `id` - Primary key (SERIAL)
- `fullname` - Teacher's full name
- `email` - Unique email address
- `mobile` - Phone number
- `password` - Hashed password
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

#### 3. **subjects**
- `id` - Primary key (SERIAL)
- `subjectName` - Name of the subject
- `standard` - Class/grade level
- `division` - Class division
- `duration` - Duration in minutes
- `views` - Number of views
- `content` - Subject content/description
- `teacher_id` - Foreign key to teachers table
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

#### 4. **student_sessions**
- `id` - Primary key (SERIAL)
- `student_id` - Foreign key to students table
- `token` - JWT token
- `expires_at` - Token expiration timestamp
- `created_at` - Record creation timestamp

#### 5. **teacher_sessions**
- `id` - Primary key (SERIAL)
- `teacher_id` - Foreign key to teachers table
- `token` - JWT token
- `expires_at` - Token expiration timestamp
- `created_at` - Record creation timestamp

### Indexes
- Email indexes for fast lookups
- Roll number index for students
- Standard/division composite indexes
- Token indexes for session management
- Subject name indexes

### Constraints
- Foreign key constraints with CASCADE/SET NULL
- Unique constraints on emails and roll numbers
- Unique constraint on subject name + standard + division

### Triggers
- Automatic `updated_at` timestamp updates

## 🔧 Environment Configuration

Make sure your `.env` file contains:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

For Supabase:
```env
DATABASE_URL="postgresql://postgres.username:password@aws-region.pooler.supabase.com:5432/postgres"
```

## 📝 Sample Data

The `sample_data.sql` file includes:

### Teachers (4)
- John Doe (john.doe@deafso.com)
- Jane Smith (jane.smith@deafso.com)
- Mike Johnson (mike.johnson@deafso.com)
- Sarah Wilson (sarah.wilson@deafso.com)

### Students (6)
- Alice Johnson (10A)
- Bob Smith (10A)
- Charlie Brown (10A)
- Diana Prince (10A)
- Eve Wilson (10B)
- Frank Miller (10B)

### Subjects (18 total)
- **Class 10A**: Mathematics, Physics, Chemistry, Biology, English Literature, History, Geography
- **Class 10B**: Mathematics, Physics, Chemistry, Biology, English Literature, History, Geography
- **Class 9A**: Mathematics, Science, English, Social Studies

## 🔍 Useful Queries

### Check table structure
```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'students'
ORDER BY ordinal_position;
```

### Get subjects with teacher info
```sql
SELECT 
    s."subjectName",
    s.standard,
    s.division,
    t.fullname as teacher_name
FROM subjects s
LEFT JOIN teachers t ON s.teacher_id = t.id
ORDER BY s.standard, s.division, s."subjectName";
```

### Get student count by class
```sql
SELECT 
    standard,
    division,
    COUNT(*) as student_count
FROM students
GROUP BY standard, division
ORDER BY standard, division;
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Error**: Check your `DATABASE_URL` format
2. **SSL Error**: Add `?sslmode=require` to your connection string
3. **Permission Error**: Ensure your database user has CREATE privileges
4. **Duplicate Key Error**: Use `ON CONFLICT` clauses in your INSERT statements

### Reset Database
```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS student_sessions CASCADE;
DROP TABLE IF EXISTS teacher_sessions CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/) 
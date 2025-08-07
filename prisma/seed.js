const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create teachers
  console.log('👨‍🏫 Creating teachers...');
  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'john.doe@deafso.com' },
    update: {},
    create: {
      fullname: 'John Doe',
      email: 'john.doe@deafso.com',
      mobile: '9876543210',
      password: hashedPassword,
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'jane.smith@deafso.com' },
    update: {},
    create: {
      fullname: 'Jane Smith',
      email: 'jane.smith@deafso.com',
      mobile: '9876543211',
      password: hashedPassword,
    },
  });

  console.log('✅ Teachers created:', teacher1.fullname, 'and', teacher2.fullname);

  // Create subjects
  console.log('📚 Creating subjects...');
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { 
        subjectName_standard_division: {
          subjectName: 'Mathematics',
          standard: '10',
          division: 'A'
        }
      },
      update: {},
      create: {
        subjectName: 'Mathematics',
        standard: '10',
        division: 'A',
        duration: 45,
        views: 150,
        content: 'Advanced mathematics concepts including algebra and geometry',
        teacherId: teacher1.id,
      },
    }),
    prisma.subject.upsert({
      where: { 
        subjectName_standard_division: {
          subjectName: 'Science',
          standard: '10',
          division: 'A'
        }
      },
      update: {},
      create: {
        subjectName: 'Science',
        standard: '10',
        division: 'A',
        duration: 40,
        views: 120,
        content: 'Physics, Chemistry, and Biology fundamentals',
        teacherId: teacher1.id,
      },
    }),
    prisma.subject.upsert({
      where: { 
        subjectName_standard_division: {
          subjectName: 'English',
          standard: '10',
          division: 'A'
        }
      },
      update: {},
      create: {
        subjectName: 'English',
        standard: '10',
        division: 'A',
        duration: 35,
        views: 100,
        content: 'English literature and grammar',
        teacherId: teacher2.id,
      },
    }),
    prisma.subject.upsert({
      where: { 
        subjectName_standard_division: {
          subjectName: 'History',
          standard: '10',
          division: 'A'
        }
      },
      update: {},
      create: {
        subjectName: 'History',
        standard: '10',
        division: 'A',
        duration: 30,
        views: 80,
        content: 'World history and important events',
        teacherId: teacher2.id,
      },
    }),
  ]);

  console.log('✅ Subjects created:', subjects.length, 'subjects');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
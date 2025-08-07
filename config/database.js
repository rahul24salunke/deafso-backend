const prisma = require('../lib/prisma');
require('dotenv').config();

// Test database connection
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  testConnection
}; 
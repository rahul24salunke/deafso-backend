const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Middleware to authenticate student JWT token
const authenticateStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database and is not expired
    const session = await prisma.studentSession.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: decoded.studentId },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        standard: true,
        division: true,
        rollnumber: true
      }
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student not found.'
      });
    }

    req.student = student;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// Middleware to authenticate teacher JWT token
const authenticateTeacher = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in database and is not expired
    const session = await prisma.teacherSession.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    // Get teacher details
    const teacher = await prisma.teacher.findUnique({
      where: { id: decoded.teacherId },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true
      }
    });

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Teacher not found.'
      });
    }

    req.teacher = teacher;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

module.exports = {
  authenticateStudent,
  authenticateTeacher
}; 
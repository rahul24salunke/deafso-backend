const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Store token in database
const storeToken = async (userId, token, userType) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

  if (userType === 'student') {
    await prisma.studentSession.create({
      data: {
        studentId: userId,
        token: token,
        expiresAt: expiresAt
      }
    });
  } else {
    await prisma.teacherSession.create({
      data: {
        teacherId: userId,
        token: token,
        expiresAt: expiresAt
      }
    });
  }
};

// Student Signup
const studentSignup = async (req, res) => {
  try {
    const { fullname, email, mobile, password, standard, division, rollnumber } = req.body;

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: email },
          { rollnumber: rollnumber }
        ]
      }
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new student
    const student = await prisma.student.create({
      data: {
        fullname,
        email,
        mobile,
        password: hashedPassword,
        standard,
        division,
        rollnumber
      }
    });

    // Generate JWT token
    const token = generateToken({ studentId: student.id });

    // Store token in database
    await storeToken(student.id, token, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: student.id,
        fullname,
        email,
        mobile,
        standard,
        division,
        rollnumber
      },
      token
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email: email }
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({ studentId: student.id });

    // Store token in database
    await storeToken(student.id, token, 'student');

    res.status(200).json({
      success: true,
      message: 'Student logged in successfully',
      data: {
        id: student.id,
        fullname: student.fullname,
        email: student.email,
        mobile: student.mobile,
        standard: student.standard,
        division: student.division,
        rollnumber: student.rollnumber
      },
      token
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Teacher Signup
const teacherSignup = async (req, res) => {
  try {
    const { fullname, email, mobile, password } = req.body;

    // Check if teacher already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email: email }
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new teacher
    const teacher = await prisma.teacher.create({
      data: {
        fullname,
        email,
        mobile,
        password: hashedPassword
      }
    });

    // Generate JWT token
    const token = generateToken({ teacherId: teacher.id });

    // Store token in database
    await storeToken(teacher.id, token, 'teacher');

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: {
        id: teacher.id,
        fullname,
        email,
        mobile
      },
      token
    });
  } catch (error) {
    console.error('Teacher signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Teacher Login
const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await prisma.teacher.findUnique({
      where: { email: email }
    });

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({ teacherId: teacher.id });

    // Store token in database
    await storeToken(teacher.id, token, 'teacher');

    res.status(200).json({
      success: true,
      message: 'Teacher logged in successfully',
      data: {
        id: teacher.id,
        fullname: teacher.fullname,
        email: teacher.email,
        mobile: teacher.mobile
      },
      token
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout (invalidate token)
const logout = async (req, res) => {
  try {
    const token = req.token;
    const userType = req.student ? 'student' : 'teacher';
    
    // Remove token from database
    if (userType === 'student') {
      await prisma.studentSession.deleteMany({
        where: { token: token }
      });
    } else {
      await prisma.teacherSession.deleteMany({
        where: { token: token }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  studentSignup,
  studentLogin,
  teacherSignup,
  teacherLogin,
  logout
}; 
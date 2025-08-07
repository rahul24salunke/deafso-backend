const express = require('express');
const router = express.Router();

const {
  getStudentProfile,
  getStudentSubjects,
  getTeacherProfile,
  getStudentsInClass,
  getSubjectDetails
} = require('../controllers/dashboardController');

const {
  authenticateStudent,
  authenticateTeacher
} = require('../middleware/authMiddleware');

const {
  validateStudentId,
  validateStandardDivision
} = require('../middleware/validationMiddleware');

// Student Dashboard Routes (protected)
router.get('/student/profile/:studentID', authenticateStudent, validateStudentId, getStudentProfile);
router.get('/student/subjects/:standard/:division', authenticateStudent, validateStandardDivision, getStudentSubjects);

// Teacher Dashboard Routes (protected)
router.get('/teacher/profile/:teacherID', authenticateTeacher, getTeacherProfile);

// Additional Routes (can be accessed by both students and teachers)
router.get('/class/:standard/:division/students', validateStandardDivision, getStudentsInClass);
router.get('/subject/:subjectId', getSubjectDetails);

module.exports = router; 
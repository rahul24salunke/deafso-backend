const express = require("express");
const router = express.Router();

const {
  studentSignup,
  studentLogin,
  teacherSignup,
  teacherLogin,
  logout,
} = require("../controllers/authController");

const {
  validateStudentSignup,
  validateStudentLogin,
  validateTeacherSignup,
  validateTeacherLogin,
} = require("../middleware/validationMiddleware");

const {
  authenticateStudent,
  authenticateTeacher,
} = require("../middleware/authMiddleware");

// Student Authentication Routes
router.post("/student/signup", validateStudentSignup, studentSignup);
router.post("/student/login", validateStudentLogin, studentLogin);

// Teacher Authentication Routes
router.post("/teacher/signup", validateTeacherSignup, teacherSignup);
router.post("/teacher/login", validateTeacherLogin, teacherLogin);

// Logout Routes (protected)
router.post("/student/logout", authenticateStudent, logout);
router.post("/teacher/logout", authenticateTeacher, logout);

module.exports = router;

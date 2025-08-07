const { prisma } = require('../config/database');

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Get student profile with proper validation
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentID) },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        standard: true,
        division: true,
        rollnumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        id: student.id,
        fullname: student.fullname,
        email: student.email,
        mobile: student.mobile,
        standard: student.standard,
        division: student.division,
        rollnumber: student.rollnumber,
        created_at: student.createdAt,
        updated_at: student.updatedAt
      }
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Subjects for Student (with proper JOINs)
const getStudentSubjects = async (req, res) => {
  try {
    const { standard, division } = req.params;

    // Get subjects with teacher information using Prisma relations
    const subjects = await prisma.subject.findMany({
      where: {
        standard: standard,
        division: division
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      },
      orderBy: {
        subjectName: 'asc'
      }
    });

    if (subjects.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No subjects found for this standard and division',
        data: []
      });
    }

    // Format the response
    const formattedSubjects = subjects.map(subject => ({
      id: subject.id,
      subjectName: subject.subjectName,
      duration: subject.duration,
      views: subject.views,
      content: subject.content,
      teacher: subject.teacher ? {
        id: subject.teacher.id,
        name: subject.teacher.fullname,
        email: subject.teacher.email
      } : null,
      created_at: subject.createdAt,
      updated_at: subject.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Subjects retrieved successfully',
      data: formattedSubjects,
      count: formattedSubjects.length
    });
  } catch (error) {
    console.error('Get student subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Teacher Profile (additional endpoint)
const getTeacherProfile = async (req, res) => {
  try {
    const { teacherID } = req.params;

    // Get teacher profile
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(teacherID) },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get subjects taught by this teacher
    const subjects = await prisma.subject.findMany({
      where: { teacherId: parseInt(teacherID) },
      select: {
        id: true,
        subjectName: true,
        standard: true,
        division: true,
        duration: true,
        views: true,
        createdAt: true
      },
      orderBy: [
        { standard: 'asc' },
        { division: 'asc' },
        { subjectName: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Teacher profile retrieved successfully',
      data: {
        id: teacher.id,
        fullname: teacher.fullname,
        email: teacher.email,
        mobile: teacher.mobile,
        created_at: teacher.createdAt,
        updated_at: teacher.updatedAt,
        subjects: subjects.map(subject => ({
          ...subject,
          created_at: subject.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Students in a Class (additional endpoint)
const getStudentsInClass = async (req, res) => {
  try {
    const { standard, division } = req.params;

    const students = await prisma.student.findMany({
      where: {
        standard: standard,
        division: division
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        rollnumber: true,
        createdAt: true
      },
      orderBy: {
        rollnumber: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Students in class retrieved successfully',
              data: students.map(student => ({
          ...student,
          created_at: student.createdAt
        })),
      count: students.length
    });
  } catch (error) {
    console.error('Get students in class error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Subject Details with Student Count (additional endpoint)
const getSubjectDetails = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Get subject details with teacher info and student count
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(subjectId) },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Get student count for this class
    const studentCount = await prisma.student.count({
      where: {
        standard: subject.standard,
        division: subject.division
      }
    });

    res.status(200).json({
      success: true,
      message: 'Subject details retrieved successfully',
      data: {
        id: subject.id,
        subjectName: subject.subjectName,
        standard: subject.standard,
        division: subject.division,
        duration: subject.duration,
        views: subject.views,
        content: subject.content,
        teacher: subject.teacher ? {
          id: subject.teacher.id,
          name: subject.teacher.fullname,
          email: subject.teacher.email
        } : null,
        student_count: studentCount,
        created_at: subject.createdAt,
        updated_at: subject.updatedAt
      }
    });
  } catch (error) {
    console.error('Get subject details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getStudentProfile,
  getStudentSubjects,
  getTeacherProfile,
  getStudentsInClass,
  getSubjectDetails
}; 
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import {
  User,
  Department,
  Subject,
  Attendance,
  Assessment,
  Notice,
  Timetable,
} from '../models/index.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { validateEnvironment } from '../config/environment.js';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Validate environment
validateEnvironment();

const ROLES = ['admin', 'faculty', 'student'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ASSESSMENT_TYPES = ['internal', 'assignment', 'exam'];

const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    logger.info('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Assessment.deleteMany({});
    await Notice.deleteMany({});
    await Timetable.deleteMany({});

    // Create departments
    logger.info('📚 Creating departments...');
    const departments = [];
    const departmentData = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Electronics', code: 'EC' },
      { name: 'Mechanical', code: 'ME' },
      { name: 'Civil', code: 'CE' },
      { name: 'Electrical', code: 'EE' },
    ];

    for (const data of departmentData) {
      const dept = await Department.create({
        name: data.name,
        code: data.code,
        description: `${data.name} Department`,
      });
      departments.push(dept);
      logger.info(`✅ Created department: ${dept.name}`);
    }

    // Create admin user
    logger.info('👨‍💼 Creating admin user...');
    const admin = await User.create({
      clerkId: 'admin_clerk_id_' + Date.now(),
      userId: 'admin001',
      name: 'Admin User',
      email: 'admin@campusflow.com',
      phone: '9999999999',
      role: 'admin',
      avatar: faker.image.avatar(),
    });
    logger.info(`✅ Created admin: ${admin.email}`);

    // Create faculty and students for each department
    const facultyMap = {};
    const studentsByDept = {};
    const subjectsByDept = {};

    for (const dept of departments) {
      logger.info(`\n📖 Setting up ${dept.name}...`);

      // Create faculty
      const faculty = [];
      for (let i = 0; i < 3; i++) {
        const f = await User.create({
          clerkId: `faculty_${dept._id}_${i}_` + Date.now(),
          userId: `faculty_${dept.code}_${i + 1}`,
          name: faker.name.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('##########'),
          role: 'faculty',
          department: dept._id,
          avatar: faker.image.avatar(),
        });
        faculty.push(f);
      }
      facultyMap[dept._id] = faculty;
      logger.info(`✅ Created 3 faculty members for ${dept.name}`);

      // Create subjects
      const subjects = [];
      for (let sem = 1; sem <= 4; sem++) {
        for (let i = 0; i < 3; i++) {
          const subject = await Subject.create({
            subjectCode: `${dept.code}${sem}${i + 1}`,
            name: `${dept.code} Subject ${sem}-${i + 1}`,
            description: faker.lorem.sentence(),
            department: dept._id,
            semester: sem,
            credits: 3,
            assignedFaculty: faculty[i % faculty.length]._id,
          });
          subjects.push(subject);
        }
      }
      subjectsByDept[dept._id] = subjects;
      logger.info(`✅ Created ${subjects.length} subjects for ${dept.name}`);

      // Create students
      const students = [];
      for (let i = 0; i < 50; i++) {
        const semester = Math.floor(i / 10) + 1; // Distribute students across semesters
        const student = await User.create({
          clerkId: `student_${dept._id}_${i}_` + Date.now(),
          userId: `student_${dept.code}_${i + 1}`,
          name: faker.name.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('##########'),
          role: 'student',
          department: dept._id,
          semester: Math.min(semester, 8),
          avatar: faker.image.avatar(),
        });

        // Enroll in subjects
        const deptSubjects = subjects.filter((s) => s.semester === student.semester);
        student.enrolledSubjects = deptSubjects.map((s) => s._id);
        await student.save();

        // Update subjects with student enrollment
        for (const subj of deptSubjects) {
          await Subject.findByIdAndUpdate(subj._id, {
            $addToSet: { enrolledStudents: student._id },
          });
        }

        students.push(student);
      }
      studentsByDept[dept._id] = students;
      logger.info(`✅ Created 50 students for ${dept.name}`);
    }

    // Create attendance records (last 30 days)
    logger.info('\n📋 Creating attendance records...');
    for (const dept of departments) {
      const subjects = subjectsByDept[dept._id];
      const students = studentsByDept[dept._id];

      for (const subject of subjects) {
        for (let day = 0; day < 30; day++) {
          const date = new Date();
          date.setDate(date.getDate() - day);

          const records = students.map((student) => ({
            student: student._id,
            status: Math.random() > 0.2 ? 'Present' : 'Absent',
          }));

          await Attendance.create({
            subject: subject._id,
            date,
            records,
            createdBy: facultyMap[dept._id][0]._id,
          });
        }
      }
    }
    logger.info(`✅ Created attendance records`);

    // Create assessments
    logger.info('📝 Creating assessments...');
    for (const dept of departments) {
      const subjects = subjectsByDept[dept._id];
      const students = studentsByDept[dept._id];

      for (const subject of subjects) {
        for (let i = 0; i < 3; i++) {
          const records = students.map((student) => ({
            student: student._id,
            marksObtained: Math.floor(Math.random() * 100),
            remarks: Math.random() > 0.5 ? 'Good performance' : '',
          }));

          await Assessment.create({
            subject: subject._id,
            title: `${ASSESSMENT_TYPES[i % ASSESSMENT_TYPES.length]} Assessment ${i + 1}`,
            description: faker.lorem.sentence(),
            maxMarks: 100,
            assessmentType: ASSESSMENT_TYPES[i % ASSESSMENT_TYPES.length],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            records,
            createdBy: facultyMap[dept._id][0]._id,
            isPublished: true,
          });
        }
      }
    }
    logger.info(`✅ Created assessments`);

    // Create notices
    logger.info('📢 Creating notices...');
    for (let i = 0; i < 10; i++) {
      await Notice.create({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(2),
        author: admin._id,
        audience: 'global',
        isPublished: true,
        attachments: [],
      });
    }
    logger.info(`✅ Created 10 notices`);

    // Create timetables
    logger.info('⏰ Creating timetables...');
    for (const dept of departments) {
      const subjects = subjectsByDept[dept._id];

      for (const subject of subjects.slice(0, 5)) {
        for (let day = 0; day < 6; day++) {
          const startHour = 8 + Math.floor(day / 2) * 2;
          const startTime = `${String(startHour).padStart(2, '0')}:00`;
          const endTime = `${String(startHour + 1).padStart(2, '0')}:00`;

          await Timetable.create({
            subject: subject._id,
            dayOfWeek: DAYS[day],
            startTime,
            endTime,
            classroom: `Room ${100 + day}`,
            semester: subject.semester,
            academicYear: new Date().getFullYear().toString(),
            faculty: facultyMap[dept._id][0]._id,
          });
        }
      }
    }
    logger.info(`✅ Created timetables`);

    logger.info('\n✅ Database seeding completed successfully!');
    logger.info('📊 Summary:');
    logger.info(`   - Departments: ${departments.length}`);
    logger.info(`   - Admin users: 1`);
    logger.info(`   - Faculty users: ${departments.length * 3}`);
    logger.info(`   - Student users: ${departments.length * 50}`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedDatabase();

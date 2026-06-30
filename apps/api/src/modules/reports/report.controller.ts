import type { Request, Response, NextFunction } from 'express';
import {
  UserModel,
  CourseModel,
  EnrollmentModel,
  BranchModel,
  TransactionModel,
  AttendanceModel,
  ExamSubmissionModel,
} from '@amozesh/database';
import { TransactionType, PaymentStatus } from '@amozesh/shared';

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalBranches,
      activeEnrollments,
      monthlyRevenue,
      dailyRevenue,
      recentEnrollments,
    ] = await Promise.all([
      UserModel.countDocuments({ role: 'student', isDeleted: { $ne: true } }),
      UserModel.countDocuments({ role: 'teacher', isDeleted: { $ne: true } }),
      CourseModel.countDocuments({ isDeleted: { $ne: true } }),
      BranchModel.countDocuments({ isDeleted: { $ne: true } }),
      EnrollmentModel.countDocuments({ status: 'active' }),
      TransactionModel.aggregate([
        { $match: { type: TransactionType.TUITION, status: PaymentStatus.SUCCESS, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      TransactionModel.aggregate([
        { $match: { type: TransactionType.TUITION, status: PaymentStatus.SUCCESS, createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      EnrollmentModel.find()
        .populate('studentId', 'fullName')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const totalRevenue = await TransactionModel.aggregate([
      { $match: { type: TransactionType.TUITION, status: PaymentStatus.SUCCESS } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.ok({
      overview: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalBranches,
        activeEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        dailyRevenue: dailyRevenue[0]?.total || 0,
      },
      recentEnrollments,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const [courses, totalStudents] = await Promise.all([
      CourseModel.find({ teacherId: id, isDeleted: { $ne: true } }).lean(),
      EnrollmentModel.countDocuments({
        courseId: { $in: (await CourseModel.find({ teacherId: id }).select('_id').lean()).map((c) => c._id) },
        status: 'active',
      }),
    ]);

    const attendanceStats = await AttendanceModel.aggregate([
      { $match: { sessionId: { $exists: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.ok({
      coursesCount: courses.length,
      totalStudents,
      courses,
      attendanceStats,
    });
  } catch (err) {
    next(err);
  }
}

export async function getStudentStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const [enrollments, examResults] = await Promise.all([
      EnrollmentModel.find({ studentId: id })
        .populate('courseId', 'title type')
        .sort({ createdAt: -1 })
        .lean(),
      ExamSubmissionModel.find({ studentId: id })
        .populate('examId', 'title')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const activeEnrollments = enrollments.filter((e) => e.status === 'active').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;

    res.ok({
      totalEnrollments: enrollments.length,
      activeEnrollments,
      completedEnrollments,
      enrollments,
      examResults,
    });
  } catch (err) {
    next(err);
  }
}

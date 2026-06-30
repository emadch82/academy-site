import type { Request, Response, NextFunction } from 'express';
import { ExamModel, QuestionModel, ExamSubmissionModel } from '@amozesh/database';
import { Errors, ExamSubmissionStatus, type PaginationQueryInput } from '@amozesh/shared';

export async function getExams(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as PaginationQueryInput & { courseId?: string };
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;

    const [items, total] = await Promise.all([
      ExamModel.find(filter)
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ExamModel.countDocuments(filter),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

export async function getExamById(req: Request, res: Response, next: NextFunction) {
  try {
    const exam = await ExamModel.findById(req.params.id).populate('courseId', 'title').lean();
    if (!exam) throw Errors.notFound('آزمون یافت نشد');
    res.ok(exam);
  } catch (err) {
    next(err);
  }
}

export async function createExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const exam = await ExamModel.create(data);
    res.created(exam, 'آزمون با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function updateExam(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.updatedBy = req.user?.id;
    const exam = await ExamModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!exam) throw Errors.notFound('آزمون یافت نشد');
    res.ok(exam, 'آزمون به‌روزرسانی شد');
  } catch (err) {
    next(err);
  }
}

export async function deleteExam(req: Request, res: Response, next: NextFunction) {
  try {
    const exam = await ExamModel.findById(req.params.id);
    if (!exam) throw Errors.notFound('آزمون یافت نشد');
    await exam.deleteSoft();
    res.noContent();
  } catch (err) {
    next(err);
  }
}

export async function getQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const questions = await QuestionModel.find({ examId: req.params.id })
      .sort({ order: 1 })
      .lean();
    res.ok(questions);
  } catch (err) {
    next(err);
  }
}

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    data.examId = req.params.id;
    data.createdBy = req.user?.id;
    const question = await QuestionModel.create(data);

    // افزایش شمارنده سوالات
    await ExamModel.findByIdAndUpdate(req.params.id, { $inc: { questionsCount: 1 } });

    res.created(question, 'سوال با موفقیت ایجاد شد');
  } catch (err) {
    next(err);
  }
}

export async function submitExam(req: Request, res: Response, next: NextFunction) {
  try {
    const exam = await ExamModel.findById(req.params.id);
    if (!exam) throw Errors.notFound('آزمون یافت نشد');
    if (exam.status !== 'active') throw Errors.badRequest('آزمون فعال نیست');

    // بررسی مهلت
    if (exam.endTime && new Date() > exam.endTime) {
      throw Errors.badRequest('مهلت آزمون تمام شده است');
    }

    // بررسی تعداد تلاش
    const previousAttempts = await ExamSubmissionModel.countDocuments({
      examId: req.params.id,
      studentId: req.user?.id,
    });
    if (previousAttempts >= exam.maxAttempts) {
      throw Errors.badRequest('تعداد تلاش‌های مجاز تمام شده است');
    }

    const { answers } = req.body;

    // دریافت سوالات
    const questions = await QuestionModel.find({ examId: req.params.id }).lean();

    // تصحیح خودکار
    let score = 0;
    const gradedAnswers = answers.map((ans: any) => {
      const question = questions.find((q) => String(q._id) === ans.questionId);
      if (!question) return { ...ans, isCorrect: false, marks: 0 };

      let isCorrect = false;
      if (question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'fill_blank') {
        isCorrect = Array.isArray(question.correctAnswer)
          ? JSON.stringify(ans.answer.sort()) === JSON.stringify(question.correctAnswer.sort())
          : ans.answer === question.correctAnswer;
      }

      const marks = isCorrect ? question.marks : (exam.negativeMarking ? -exam.negativeMarkValue : 0);
      if (isCorrect) score += question.marks;
      else if (exam.negativeMarking) score = Math.max(0, score - exam.negativeMarkValue);

      return { ...ans, isCorrect, marks };
    });

    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const isPassed = percentage >= (exam.passingMarks / exam.totalMarks) * 100;

    await ExamSubmissionModel.create({
      examId: req.params.id,
      studentId: req.user?.id,
      answers: gradedAnswers,
      score,
      percentage,
      isPassed,
      status: ExamSubmissionStatus.SUBMITTED,
      submitTime: new Date(),
      ipAddress: req.ip,
      createdBy: req.user?.id,
    });

    res.created({
      score,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      isPassed,
      answers: exam.showResults ? gradedAnswers : undefined,
    }, 'آزمون با موفقیت تحویل داده شد');
  } catch (err) {
    next(err);
  }
}

export async function getExamResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 50 } = req.query as PaginationQueryInput;
    const pageNum = Number(page) || 1;
    const limitNum = Math.min(Number(limit) || 50, 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      ExamSubmissionModel.find({ examId: req.params.id })
        .populate('studentId', 'fullName mobile')
        .sort({ score: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ExamSubmissionModel.countDocuments({ examId: req.params.id }),
    ]);

    res.okPaginated({ items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
}

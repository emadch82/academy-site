/** نوع سوال آزمون */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  FILL_BLANK = 'fill_blank',
  FILE_BASED = 'file_based',
}

/** وضعیت آزمون */
export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  GRADED = 'graded',
}

/** وضعیت تکمیل آزمون */
export enum ExamSubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
}

/** وضعیت تکلیف */
export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

/** وضعیت تحویل تکلیف */
export enum AssignmentSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  RETURNED = 'returned',
  LATE = 'late',
}

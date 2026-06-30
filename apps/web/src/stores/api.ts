import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = Cookies.get('amz_access');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'Branch',
    'Classroom',
    'Course',
    'Enrollment',
    'Session',
    'Attendance',
    'Exam',
    'Assignment',
    'Certificate',
    'Invoice',
    'Payment',
    'Lead',
    'Notification',
    'Article',
    'Banner',
    'FAQ',
    'Testimonial',
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    refreshToken: builder.mutation({
      query: (token) => ({ url: '/auth/refresh', method: 'POST', body: { token } }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),

    getUsers: builder.query({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation({
      query: (data) => ({ url: '/users', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    getBranches: builder.query({
      query: (params) => ({ url: '/branches', params }),
      providesTags: ['Branch'],
    }),
    getBranchById: builder.query({
      query: (id) => `/branches/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Branch', id }],
    }),
    createBranch: builder.mutation({
      query: (data) => ({ url: '/branches', method: 'POST', body: data }),
      invalidatesTags: ['Branch'],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/branches/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Branch', id }],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({ url: `/branches/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Branch'],
    }),

    getCourses: builder.query({
      query: (params) => ({ url: '/courses', params }),
      providesTags: ['Course'],
    }),
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Course', id }],
    }),
    createCourse: builder.mutation({
      query: (data) => ({ url: '/courses', method: 'POST', body: data }),
      invalidatesTags: ['Course'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/courses/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Course', id }],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({ url: `/courses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Course'],
    }),

    getEnrollments: builder.query({
      query: (params) => ({ url: '/enrollments', params }),
      providesTags: ['Enrollment'],
    }),
    getEnrollmentById: builder.query({
      query: (id) => `/enrollments/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Enrollment', id }],
    }),
    createEnrollment: builder.mutation({
      query: (data) => ({ url: '/enrollments', method: 'POST', body: data }),
      invalidatesTags: ['Enrollment'],
    }),
    cancelEnrollment: builder.mutation({
      query: (id) => ({ url: `/enrollments/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: ['Enrollment'],
    }),

    getSessions: builder.query({
      query: (params) => ({ url: '/sessions', params }),
      providesTags: ['Session'],
    }),
    getSessionById: builder.query({
      query: (id) => `/sessions/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Session', id }],
    }),
    createSession: builder.mutation({
      query: (data) => ({ url: '/sessions', method: 'POST', body: data }),
      invalidatesTags: ['Session'],
    }),
    updateSession: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/sessions/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Session', id }],
    }),
    deleteSession: builder.mutation({
      query: (id) => ({ url: `/sessions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Session'],
    }),

    getAttendance: builder.query({
      query: (params) => ({ url: '/attendance', params }),
      providesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation({
      query: (data) => ({ url: '/attendance', method: 'POST', body: data }),
      invalidatesTags: ['Attendance'],
    }),
    getAttendanceReport: builder.query({
      query: (params) => ({ url: '/attendance/report', params }),
      providesTags: ['Attendance'],
    }),

    getExams: builder.query({
      query: (params) => ({ url: '/exams', params }),
      providesTags: ['Exam'],
    }),
    getExamById: builder.query({
      query: (id) => `/exams/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Exam', id }],
    }),
    createExam: builder.mutation({
      query: (data) => ({ url: '/exams', method: 'POST', body: data }),
      invalidatesTags: ['Exam'],
    }),
    submitExam: builder.mutation({
      query: ({ id, ...answers }) => ({ url: `/exams/${id}/submit`, method: 'POST', body: answers }),
      invalidatesTags: ['Exam'],
    }),
    getExamResults: builder.query({
      query: (id) => `/exams/${id}/results`,
      providesTags: ['Exam'],
    }),

    getAssignments: builder.query({
      query: (params) => ({ url: '/assignments', params }),
      providesTags: ['Assignment'],
    }),
    getAssignmentById: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Assignment', id }],
    }),
    createAssignment: builder.mutation({
      query: (data) => ({ url: '/assignments', method: 'POST', body: data }),
      invalidatesTags: ['Assignment'],
    }),
    submitAssignment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/assignments/${id}/submit`, method: 'POST', body: data }),
      invalidatesTags: ['Assignment'],
    }),
    gradeSubmission: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/assignments/${id}/grade`, method: 'POST', body: data }),
      invalidatesTags: ['Assignment'],
    }),

    getCertificates: builder.query({
      query: (params) => ({ url: '/certificates', params }),
      providesTags: ['Certificate'],
    }),
    getCertificateById: builder.query({
      query: (id) => `/certificates/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Certificate', id }],
    }),
    verifyCertificate: builder.query({
      query: (serialNumber) => `/certificates/verify/${serialNumber}`,
      providesTags: ['Certificate'],
    }),
    issueCertificate: builder.mutation({
      query: (data) => ({ url: '/certificates', method: 'POST', body: data }),
      invalidatesTags: ['Certificate'],
    }),

    getInvoices: builder.query({
      query: (params) => ({ url: '/payments/invoices', params }),
      providesTags: ['Invoice'],
    }),
    getInvoiceById: builder.query({
      query: (id) => `/payments/invoices/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Invoice', id }],
    }),
    createInvoice: builder.mutation({
      query: (data) => ({ url: '/payments/invoices', method: 'POST', body: data }),
      invalidatesTags: ['Invoice'],
    }),
    initiatePayment: builder.mutation({
      query: (data) => ({ url: '/payments/initiate', method: 'POST', body: data }),
      invalidatesTags: ['Invoice'],
    }),

    getLeads: builder.query({
      query: (params) => ({ url: '/crm/leads', params }),
      providesTags: ['Lead'],
    }),
    getLeadById: builder.query({
      query: (id) => `/crm/leads/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Lead', id }],
    }),
    createLead: builder.mutation({
      query: (data) => ({ url: '/crm/leads', method: 'POST', body: data }),
      invalidatesTags: ['Lead'],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/crm/leads/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Lead', id }],
    }),
    convertLead: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/crm/leads/${id}/convert`, method: 'POST', body: data }),
      invalidatesTags: ['Lead'],
    }),

    getNotifications: builder.query({
      query: (params) => ({ url: '/notifications', params }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
    getUnreadCount: builder.query({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),

    getArticles: builder.query({
      query: (params) => ({ url: '/cms/articles', params }),
      providesTags: ['Article'],
    }),
    getArticleBySlug: builder.query({
      query: (slug) => `/cms/articles/${slug}`,
      providesTags: (_result, _err, slug) => [{ type: 'Article', id: slug }],
    }),
    createArticle: builder.mutation({
      query: (data) => ({ url: '/cms/articles', method: 'POST', body: data }),
      invalidatesTags: ['Article'],
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/cms/articles/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Article', id }],
    }),
    getBanners: builder.query({
      query: (params) => ({ url: '/cms/banners', params }),
      providesTags: ['Banner'],
    }),
    createBanner: builder.mutation({
      query: (data) => ({ url: '/cms/banners', method: 'POST', body: data }),
      invalidatesTags: ['Banner'],
    }),
    getFaqs: builder.query({
      query: (params) => ({ url: '/cms/faqs', params }),
      providesTags: ['FAQ'],
    }),
    getTestimonials: builder.query({
      query: (params) => ({ url: '/cms/testimonials', params }),
      providesTags: ['Testimonial'],
    }),
    createTestimonial: builder.mutation({
      query: (data) => ({ url: '/cms/testimonials', method: 'POST', body: data }),
      invalidatesTags: ['Testimonial'],
    }),

    getDashboardStats: builder.query({
      query: (params) => ({ url: '/reports/dashboard', params }),
      providesTags: ['User'],
    }),
    getTeacherStats: builder.query({
      query: (params) => ({ url: '/reports/teacher', params }),
      providesTags: ['User'],
    }),
    getStudentStats: builder.query({
      query: (params) => ({ url: '/reports/student', params }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useCreateEnrollmentMutation,
  useCancelEnrollmentMutation,
  useGetSessionsQuery,
  useGetSessionByIdQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery,
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useSubmitExamMutation,
  useGetExamResultsQuery,
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useSubmitAssignmentMutation,
  useGradeSubmissionMutation,
  useGetCertificatesQuery,
  useGetCertificateByIdQuery,
  useVerifyCertificateQuery,
  useIssueCertificateMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useInitiatePaymentMutation,
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useConvertLeadMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetUnreadCountQuery,
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useGetFaqsQuery,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useGetDashboardStatsQuery,
  useGetTeacherStatsQuery,
  useGetStudentStatsQuery,
} = apiSlice;

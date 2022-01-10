import routePath from 'src/constants/routePath';
import Login from 'src/pages/login';
// import Dashboard from 'src/pages/dashboard';
import Profile from 'src/pages/profile';
import TakeQuiz from 'src/pages/features/student/take-quiz/TakeQuiz';
import Quiz from 'src/pages/features/student/quiz';
import ChartStudent from 'src/pages/features/student/chart-student';
import ManageTestTeacher from 'src/pages/features/teacher/manage-quiz-teacher';
import ManageClass from 'src/pages/features/teacher/manage-class';
import CreateLesson from 'src/pages/features/teacher/create-lesson';
import ManageTestStudent from 'src/pages/features/student/manage-quiz-student';
import Dashboard from 'src/pages/dashboard';
import JoinLesson from 'src/pages/features/student/join-lesson/JoinLesson';
import QuizResult from 'src/pages/features/teacher/quiz-result';
import EditQuiz from 'src/pages/features/teacher/edit-quiz';

const routers = {
  login: {
    exact: true,
    path: routePath.SIGN_IN,
    component: Login,
    private: false,
  },
  dashboard: {
    exact: true,
    path: routePath.DASHBOARD,
    component: Dashboard,
    private: true,
  },
  profile: {
    exact: true,
    path: routePath.PROFILE,
    component: Profile,
    private: true,
  },
  takeQuiz: {
    exact: true,
    path: routePath.TAKE_QUIZ,
    component: TakeQuiz,
    private: true,
  },
  joinLesson: {
    exact: true,
    path: routePath.JOIN_LESSON,
    component: JoinLesson,
    private: true,
  },
  quiz: {
    exact: true,
    path: routePath.QUIZ,
    component: Quiz,
    private: true,
  },
  quizResult: {
    exact: true,
    path: routePath.QUIZ_RESULT,
    component: QuizResult,
    private: true,
  },
  chartStudent: {
    exact: true,
    path: routePath.CHART_STUDENT,
    component: ChartStudent,
    private: true,
  },
  manageClass: {
    exact: true,
    path: routePath.MANAGE_CLASS,
    component: ManageClass,
    private: true,
  },
  editTest: {
    exact: true,
    path: routePath.EDIT_QUIZ,
    component: EditQuiz,
    private: true,
  },
  manageQuizTeacher: {
    exact: true,
    path: routePath.MANAGE_QUIZ,
    component: ManageTestTeacher,
    private: true,
  },
  createLesson: {
    exact: true,
    path: routePath.CREATE_LESSON,
    component: CreateLesson,
    private: true,
  },
  manageTestStudent: {
    exact: true,
    path: routePath.MY_QUIZ,
    component: ManageTestStudent,
    private: true,
  },
};

export default routers;

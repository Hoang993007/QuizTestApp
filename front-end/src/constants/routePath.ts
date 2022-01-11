const DASHBOARD = '/';
const SIGN_IN = '/sign-in';
const PROFILE = '/profile';

//teacher
const MANAGE_CLASS = '/manage-class';
const MANAGE_LESSON = '/manage-course';
const CREATE_QUIZ = '/create-quiz';
const MANAGE_QUIZ = '/manage-quiz';
const QUIZ_RESULT = '/manage-quiz/:id/result';
const EDIT_QUIZ = '/manage-quiz/:id/edit';
const MANAGE_COURSE = '/manage-course/manage-lesson';

// student
const JOIN_LESSON = '/join-course/join-lesson';
const TAKE_QUIZ = '/take-quiz';
const QUIZ = '/quiz';
const CHART_STUDENT = '/chart-student';
const CREATE_QUIZ_STUDENT = 'create-quiz-student';
const MY_QUIZ = 'my-quiz';
const JOIN_COURSE = 'join-course';

export default {
  SIGN_IN,
  DASHBOARD,
  PROFILE,

  //teacher
  MANAGE_CLASS,
  MANAGE_LESSON,
  CREATE_QUIZ,
  MANAGE_QUIZ,
  QUIZ_RESULT,
  EDIT_QUIZ,
  MANAGE_COURSE,

  //student
  JOIN_LESSON,
  TAKE_QUIZ,
  QUIZ,
  CHART_STUDENT,
  CREATE_QUIZ_STUDENT,
  MY_QUIZ,
  JOIN_COURSE,
};

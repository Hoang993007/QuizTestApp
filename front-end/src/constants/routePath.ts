const DASHBOARD = '/';
const SIGN_IN = '/sign-in';
const PROFILE = '/profile';

//teacher
const MANAGE_CLASS = '/manage-class';
const CREATE_LESSON = '/create-lesson';
const CREATE_QUIZ = '/create-quiz';
const MANAGE_QUIZ = '/manage-quiz';
const QUIZ_RESULT = '/manage-quiz/:id/result';
const EDIT_QUIZ = '/manage-quiz/:id/edit';

// student
const JOIN_LESSON = '/join-lesson';
const TAKE_QUIZ = '/take-quiz';
const QUIZ = '/quiz';
const CHART_STUDENT = '/chart-student';
const CREATE_QUIZ_STUDENT = 'create-quiz-student';
const MY_QUIZ = 'my-quiz';

export default {
  SIGN_IN,
  DASHBOARD,
  PROFILE,

  //teacher
  MANAGE_CLASS,
  CREATE_LESSON,
  CREATE_QUIZ,
  MANAGE_QUIZ,
  QUIZ_RESULT,
  EDIT_QUIZ,

  //student
  JOIN_LESSON,
  TAKE_QUIZ,
  QUIZ,
  CHART_STUDENT,
  CREATE_QUIZ_STUDENT,
  MY_QUIZ,
};

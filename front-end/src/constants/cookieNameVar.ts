import Cookies from 'js-cookie';

export enum cookieName {
  ACCESS_TOKEN = 'accessToken',
  CURRENT_QUIZ = 'current_quiz',
  CURRENT_ANSWER = 'current_answer',
  CURRENT_COUNTDOWN = 'current_coundown',
  COURSE_NAME = 'course_name',
}

export const clearQuizCookies = () => {
  Cookies.remove(cookieName.CURRENT_ANSWER);
  Cookies.remove(cookieName.CURRENT_COUNTDOWN);
  Cookies.remove(cookieName.CURRENT_QUIZ);
};

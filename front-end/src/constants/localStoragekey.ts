export enum LocalStorageKeys {
  CURRENT_QUIZ = 'current_quiz',
  CURRENT_ANSWER = 'current_answer',
  CURRENT_COUNTDOWN = 'current_coundown',
}

export const clearQuizLocalStorage = () => {
  localStorage.removeItem(LocalStorageKeys.CURRENT_ANSWER);
  localStorage.removeItem(LocalStorageKeys.CURRENT_COUNTDOWN);
  localStorage.removeItem(LocalStorageKeys.CURRENT_QUIZ);
};

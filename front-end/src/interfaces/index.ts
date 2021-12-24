import { Timestamp } from '@firebase/firestore';
import { UserRole } from 'src/constants/constants';

export interface IUserInfo {
  fullname: string;
  classID: string;
  role: UserRole;
}

export interface IClass {
  name: string;
  description: string;
}

export interface IQuizResult {
  date: Date;
  totalScore: number;
  quizID: string;
  score: number;
  userID: string;
}

export interface IQuizInfo {
  id?: string;
  name: string;
  numberOfQuestion: number;
  description: string;
  classID: string;
  timeLimit: number;
  lastModify: any;
}

export interface IQuizQuestion {
  id?: string;
  question: string;
  ans_1: string;
  ans_2: string;
  ans_3: string;
  ans_4: string;
  correct_ans?: number;
}

export interface ILessonInfo {
  id?: string;
  lessonName: string;
  content: string;
  linkYT: string;
  classID: string;
  lastModify: any;
}

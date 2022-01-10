import React, { ReactNode } from 'react';
import { secondsToTime } from 'src/helpers/indes';
import { IQuizInfo, IQuizResult } from 'src/interfaces';
import { ILessonInfo } from 'src/interfaces';
import './styles.scss';
import quizImg from 'src/assets/images/lesson.png';

export type UserLessonInfo = ILessonInfo;

const LessonInfo: React.FC<{
  lesson: UserLessonInfo;
  actions: ReactNode[];
}> = (props) => {
  const { lesson, actions } = props;

  return (
    <div className="quiz-info-container">
      <div className="quiz-info">
        <img className="quizImage" src={quizImg} alt="logo" />
        <div className="quiz-info__text">
          <span className="quiz-info__title">{lesson.lessonName}</span>
          <span className="ques-info-box">
            <span className="ques-info-label">Last modify</span>

            <span
              className="ques-info-text"
              style={{
                display: 'block',
              }}
            >
              {lesson.lastModify.toString()}
            </span>
          </span>
          <span>
            <span className="ques-info-label">Content</span>
          </span>
          <span className="quiz-description  ques-info-box">{lesson.content}</span>
        </div>
      </div>

      <div className="action-container">
        <div>{actions}</div>
      </div>
    </div>
  );
};

export default LessonInfo;

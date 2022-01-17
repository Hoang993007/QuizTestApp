import React, { ReactNode } from 'react';
import { ILessonInfo } from 'src/interfaces';
import './styles.scss';

export type UserLessonInfo = ILessonInfo;

const LessonInfo: React.FC<{
  lesson: UserLessonInfo;
  actions: ReactNode[];
}> = (props) => {
  const { lesson, actions } = props;

  return (
    <div className="lesson-info-container">
      <div className="lesson-info">
        <div className="lesson-info__text">
          <span className="lesson-info__title">{lesson.lessonName}</span>
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

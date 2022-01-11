import React, { ReactNode } from 'react';
import { ICourseInfo } from 'src/interfaces';
import './styles.scss';
import quizImg from 'src/assets/images/lesson.png';

export type UserLessonInfo = ICourseInfo;

const CourseInfo: React.FC<{
  course: UserLessonInfo;
  actions: ReactNode[];
}> = (props) => {
  const { course, actions } = props;

  return (
    <div className="quiz-info-container">
      <div className="quiz-info">
        <img className="quizImage" src={quizImg} alt="logo" />
        <div className="quiz-info__text">
          <span className="quiz-info__title">{course.courseName}</span>
          <span className="ques-info-box">
            <span className="ques-info-label">Cteated at</span>

            <span
              className="ques-info-text"
              style={{
                display: 'block',
              }}
            >
              {course.lastModify.toString()}
            </span>
          </span>
        </div>
      </div>

      <div className="action-container">
        <div>{actions}</div>
      </div>
    </div>
  );
};

export default CourseInfo;

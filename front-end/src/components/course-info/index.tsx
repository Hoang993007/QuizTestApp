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
    <div className="course-info-container">
      <div className="course-info">
        <img className="quizImage" src={quizImg} alt="logo" />
        <div className="course-info__text">
          <span className="course-info__title">{course.courseName}</span>
          <span className="ques-info-box">
            <span className="ques-info-label">Last modified</span>

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

import React, { ReactNode } from 'react';
import { ICourseInfo } from 'src/interfaces';
import './styles.scss';
import quizImg from 'src/assets/images/lesson.png';

const CourseInfo: React.FC<{
  course: ICourseInfo;
  actions: ReactNode[];
}> = (props) => {
  const { course, actions } = props;

  return (
    <div className="course-info-container">
      <div className="course-info">
        <img className="quizImage" src={quizImg} alt="logo" />
        <div className="course-info__text">
          <div className="course-info__title">{course.courseName}</div>

          <div className="ques-info-box">
            <div className="ques-info-label">Last modified</div>

            <div
              className="ques-info-text"
              style={{
                display: 'block',
                marginLeft: '2rem',
              }}
            >
              {course.lastModify.toString()}
            </div>
          </div>

          <span>
            <span className="ques-info-label">Content</span>
          </span>
          <span className="quiz-description  ques-info-box">{course.description}</span>
        </div>
      </div>

      <div className="action-container">
        <div>{actions}</div>
      </div>
    </div>
  );
};

export default CourseInfo;

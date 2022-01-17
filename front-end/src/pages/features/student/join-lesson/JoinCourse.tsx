/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import routePath from 'src/constants/routePath';
import './styles.scss';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import { ICourseInfo } from 'src/interfaces';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import Cookies from 'js-cookie';
import { Button } from 'antd';
import CourseInfo from 'src/components/course-info';

const JoinCourse: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [allLesson, setAllLesson] = useState<ICourseInfo[]>([]);
  const [isOpenLearnLesson, setIsOpenLearnLesson] = useState(false);

  const getAllUserLesson = async () => {
    try {
      console.log('getDoc');
      const allCourseSnapshot = await getDocs(
        query(collection(db, DbsName.COURSE), where('classID', '==', user.classID)),
      );

      const allCourseDoc: ICourseInfo[] = [];
      allCourseSnapshot.forEach((doc: any) => {
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        if (allCourseDoc) {
          allCourseDoc.push({
            id: doc.id,
            ...docData,
          });
        }
      });

      allCourseDoc.sort((a: ICourseInfo, b: ICourseInfo) => b.lastModify.getTime() - a.lastModify.getTime());

      setAllLesson(allCourseDoc);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllUserLesson();
    }
  }, [user]);

  const handleOnView = (course: ICourseInfo) => {
    // Cookies.set('courseName', course.id);
    navigate(routePath.JOIN_LESSON);
  };

  return (
    <>
      {allLesson.length <= 0 && <div className="no-quiz-created">You have no course to join</div>}

      {allLesson.length > 0 && (
        <div className="take-test__container">
          {allLesson[0] && (
            <>
              <div className="title new-quiz-title">NEWEST COURSE!</div>

              <CourseInfo
                course={allLesson[0]}
                actions={[
                  <Button key="start-quiz" className="joi-btn" onClick={() => handleOnView(allLesson[0])}>
                    JOIN
                  </Button>,
                ]}
              />
            </>
          )}

          {allLesson.length > 1 && (
            <>
              <div className="title other-quiz-title">OTHER COURSES</div>

              <div className="all-quiz-info-container">
                {allLesson.map((quiz, index) => {
                  if (index === 0) return;

                  return (
                    <CourseInfo
                      key={index}
                      course={quiz}
                      actions={[
                        <Button key="start-quiz" className="joi-btn" onClick={() => handleOnView(quiz)}>
                          JOIN
                        </Button>,
                      ]}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default JoinCourse;

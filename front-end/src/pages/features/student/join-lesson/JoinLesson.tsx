import React, { useEffect, useState } from 'react';
import routePath from 'src/constants/routePath';
import './styles.scss';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import { IQuizResult } from 'src/interfaces';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import Cookies from 'js-cookie';
import { cookieName } from 'src/constants/cookieNameVar';
import LessonInfo, { UserLessonInfo } from 'src/components/lesson-info';
import { Button } from 'antd';

const JoinLesson: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [allLesson, setAllLesson] = useState<UserLessonInfo[]>([]);

  const getAllUserLesson = async () => {
    try {
      /**
       * Get all user results
       */
      const allResultDoc: IQuizResult[] = [];
      console.log('getDoc');
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));

      /**
       * Get all quiz
       */
      console.log('getDoc');
      const allLessonSnapshot = await getDocs(
        query(collection(db, DbsName.LESSON), where('classID', '==', user.classID)),
      );

      const allLessonDoc: UserLessonInfo[] = [];
      allLessonSnapshot.forEach((doc: any) => {
        const quizUserResult = allResultDoc.filter((result) => result.quizID === doc.id);

        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        if (quizUserResult) {
          allLessonDoc.push({
            id: doc.id,
            ...docData,
            userResult: quizUserResult[0],
          });
        }
      });

      allLessonDoc.sort((a: UserLessonInfo, b: UserLessonInfo) => b.lastModify.getTime() - a.lastModify.getTime());

      setAllLesson(allLessonDoc);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllUserLesson();
    }
  }, [user]);

  return (
    <>
      {Cookies.get(cookieName.CURRENT_QUIZ) && <Navigate to={routePath.QUIZ} />}

      {allLesson.length <= 0 && <div className="no-quiz-created">You have no lesson to join</div>}

      {allLesson.length > 0 && (
        <div className="take-test__container">
          {allLesson[0] && (
            <>
              <div className="title new-quiz-title">NEW LESSON!</div>

              <LessonInfo lesson={allLesson[0]} actions={[<Button key="start-quiz">JOIN</Button>]} />
            </>
          )}

          {allLesson.length > 1 && (
            <>
              <div className="title other-quiz-title">OTHER LESSONS</div>

              <div className="all-quiz-info-container">
                {allLesson.map((quiz, index) => {
                  if (index === 0) return;

                  return <LessonInfo key={index} lesson={quiz} actions={[<Button key="start-quiz">JOIN</Button>]} />;
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default JoinLesson;

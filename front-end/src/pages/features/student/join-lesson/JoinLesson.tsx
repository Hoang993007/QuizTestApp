/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import routePath from 'src/constants/routePath';
import './styles.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'src/store/hooks';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import Cookies from 'js-cookie';
import { cookieName } from 'src/constants/cookieNameVar';
import LessonInfo, { UserLessonInfo } from 'src/components/lesson-info';
import { Button } from 'antd';
import LearnLesson from './learn-lesson';
import { ArrowLeftOutlined } from '@ant-design/icons';

const JoinLesson: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const navigate = useNavigate();
  const [allLesson, setAllLesson] = useState<UserLessonInfo[]>([]);
  const [isOpenLearnLesson, setIsOpenLearnLesson] = useState(false);

  const getAllUserLesson = async () => {
    try {
      const allLessonSnapshot = await getDocs(
        query(collection(db, DbsName.LESSON), where('courseName', '==', Cookies.get('courseName'))),
      );

      const allLessonDoc: UserLessonInfo[] = [];
      allLessonSnapshot.forEach((doc: any) => {
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        if (allLessonDoc) {
          allLessonDoc.push({
            id: doc.id,
            ...docData,
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

  const viewLesson = (lesson: UserLessonInfo) => {
    const str = new String(lesson.linkYT.slice(32));
    const str1 = new String('https://www.youtube.com/embed/');
    Cookies.set('viewLesson', lesson.lessonName);
    Cookies.set('content', lesson.content);
    Cookies.set('getLink', str1.concat(lesson.linkYT.slice(32)));
    setIsOpenLearnLesson(true);
  };

  return (
    <>
      {Cookies.get(cookieName.CURRENT_QUIZ) && <Navigate to={routePath.QUIZ} />}

      {isOpenLearnLesson && <LearnLesson visible={isOpenLearnLesson} setIsOpenLearnLesson={setIsOpenLearnLesson} />}

      {allLesson.length <= 0 && <div className="no-quiz-created">You have no lesson to join</div>}

      {allLesson.length > 0 && (
        <div className="take-test__container">
<<<<<<< HEAD
          {allLesson[0] && (
            <>
              <div className="title new-quiz-title">NEWEST LESSON!</div>

              <LessonInfo
                lesson={allLesson[0]}
                actions={[
                  <Button key="start-quiz" className='joi-btn' onClick={() => viewLesson(allLesson[0])}>
                    LEARN
                  </Button>,
                ]}
              />
            </>
          )}

=======
>>>>>>> cc3fa3f02797204743ee078b31e889cb1a42d9ed
          {allLesson.length > 1 && (
            <>
              <div
                onClick={() => {
                  console.log(routePath.JOIN_COURSE);
                  navigate(routePath.JOIN_COURSE);
                }}
              >
                <ArrowLeftOutlined
                  style={{
                    fontSize: '3rem',
                    marginRight: '2rem',
                    cursor: 'pointer',
                  }}
                />{' '}
                All courses
              </div>
              <div className="title other-quiz-title">TOTAL LESSON: {allLesson.length}</div>

              <div className="all-quiz-info-container">
                {allLesson.map((quiz, index) => {
                  return (
                    <LessonInfo
                      key={index}
                      lesson={quiz}
                      actions={[
                        <Button key="start-quiz" className='joi-btn' onClick={() => viewLesson(quiz)}>
                          LEARN
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

export default JoinLesson;

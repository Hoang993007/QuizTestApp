import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateLesson from './create-lesson';
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

const ManageLesson = () => {
  const [isOpenCreateLesson, setIsOpenCreateLesson] = useState(false);
  const user = useAppSelector((user) => user.account.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [allLesson, setAllLesson] = useState<UserLessonInfo[]>([]);
  const [isOpenLearnLesson, setIsOpenLearnLesson] = useState(false);

  const getAllUserLesson = async () => {
    try {
      const allResultDoc: IQuizResult[] = [];
      console.log('getDoc');
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));

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
    <div className="manage-lesson__container">
      <div className="all-lesson-info-container">
        <Button className="add-quiz" onClick={() => setIsOpenCreateLesson(true)}>
          Add new lesson <PlusCircleOutlined />
        </Button>
        <div className="title">Total lesson: {allLesson.length}</div>
        {allLesson.map((lesson, index) => {
          return (
            <LessonInfo
              key={index}
              lesson={lesson}
              actions={[
                
                <Button key="edit-quiz" className="edit-btn" >
                  Edit Lesson
                </Button>,
                <Button key="delete-quiz" className="del-btn" >
                  Delete Lesson
                </Button>,
              ]}
            />
          );
        })}
      </div>

      <CreateLesson
        visible={isOpenCreateLesson}
        setIsOpenCreateLesson={setIsOpenCreateLesson}
        getAllLesson={async () => {}}
      />
    </div>
  );
};

export default ManageLesson;

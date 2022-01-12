import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateLesson from './create-lesson';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ICourseInfo } from 'src/interfaces';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import CourseInfo from 'src/components/course-info';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { IQuizResult } from 'src/interfaces';
import LessonInfo, { UserLessonInfo } from 'src/components/lesson-info';
import routePath from 'src/constants/routePath';
import Cookies from 'js-cookie';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';

const ManageLesson: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const dispatch = useAppDispatch();
  const [allCourse, setAllCourse] = useState<ICourseInfo[]>([]);
  const [isOpenCreateLesson, setIsOpenCreateLesson] = useState(false);
  const navigate = useNavigate();
  const [allLesson, setAllLesson] = useState<UserLessonInfo[]>([]);
  const [isOpenLearnLesson, setIsOpenLearnLesson] = useState(false);

  const getAllCourse = async () => {
    try {
      const allCourseSnapshot = await getDocs(query(collection(db, DbsName.COURSE)));
      const allCourseDoc: ICourseInfo[] = [];
      allCourseSnapshot.forEach((doc: any) => {
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        allCourseDoc.push({
          id: doc.id,
          ...docData,
        });
        allCourseDoc.sort((a: ICourseInfo, b: ICourseInfo) => b.lastModify.getTime() - a.lastModify.getTime());
        setAllCourse(allCourseDoc);
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const navigateToCourse = (course: any) => {
    navigate(routePath.PROFILE);
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllCourse();
    }
  }, [user]);

  const getAllUserLesson = async () => {
    try {
      const allResultDoc: IQuizResult[] = [];
      console.log('getDoc');
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));

      console.log('getDoc');
      const allLessonSnapshot = await getDocs(
        query(collection(db, DbsName.LESSON), where('courseName', '==', Cookies.get('courseName'))),
        //query(collection(db, DbsName.LESSON), where('classID', '==', user.classID)),
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

  const handleOnDeleteLesson = async (lesson: any) => {
    try {

      deleteDoc(doc(db, DbsName.LESSON, lesson.id));

      setAllLesson(allLesson.filter((lessE) => lessE.id !== lesson.id));

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete lesson successfully', '');
    } catch (error: any) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Delete lesson failed', '');
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div className="manage-lesson__container">
      <div className="all-lesson-info-container">
        <Button className="add-quiz" onClick={() => setIsOpenCreateLesson(true)}>
          Add new lesson <PlusCircleOutlined />
        </Button>
        <div className="title">Course: {Cookies.get('courseName')}</div>
        <div className="title">Total lesson(s): {allLesson.length}</div>
        {allLesson.map((lesson, index) => {
          return (
            <LessonInfo
              key={index}
              lesson={lesson}
              actions={[
                <Button key="edit-quiz" className="edit-btn">
                  Edit Lesson
                </Button>,
                <Button key="delete-quiz" className="del-btn" onClick={() => handleOnDeleteLesson(lesson)}>
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
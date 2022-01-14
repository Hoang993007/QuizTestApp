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

const ManageCourse: React.FC = () => {
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

  const handleOnView = (course: ICourseInfo) => {
    Cookies.set('courseName', course.courseName);
    navigate(routePath.MANAGE_LESSON);
  };

  const handleOnDeleteCourse = async (course: any) => {
    try {
      console.log('getDoc');
      const allLessonSnapshot = await getDocs(
        query(collection(db, DbsName.LESSON), where('courseName', '==', course.courseName)),
      );
      allLessonSnapshot.forEach((cour) => {
        deleteDoc(doc(db, DbsName.LESSON, cour.id));
      });

      deleteDoc(doc(db, DbsName.COURSE, course.id));

      setAllCourse(allCourse.filter((courseE) => courseE.id !== course.id));

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete course successfully', '');
    } catch (error: any) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Delete course failed', '');
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
      </div>

      <div className="title">Total course: {allCourse.length}</div>
      {allCourse.map((course, index) => {
        return (
          <CourseInfo
            key={index}
            course={course}
            actions={[
              <Button key="view-lesson" className="vie-btn" onClick={() => handleOnView(course)}>
                View Lesson
              </Button>,
              <Button key="delete-course" className="del-btn" onClick={() => handleOnDeleteCourse(course)}>
                Delete Course
              </Button>,
            ]}
          />
        );
      })}

      <CreateLesson
        visible={isOpenCreateLesson}
        setIsOpenCreateLesson={setIsOpenCreateLesson}
        getAllLesson={async () => {}}
      />
    </div>
  );
};

export default ManageCourse;

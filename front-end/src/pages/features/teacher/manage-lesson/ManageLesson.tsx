/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateLesson from './create-lesson';
import { useAppSelector } from 'src/store/hooks';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import LessonInfo, { UserLessonInfo } from 'src/components/lesson-info';
import routePath from 'src/constants/routePath';
import Cookies from 'js-cookie';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import EditLesson from './edit-lesson';

const ManageLesson: React.FC = () => {
  const { courseId } = useParams();
  const [, setCourseDetails] = useState<any>();

  const user = useAppSelector((user) => user.account.user);
  const [isOpenCreateLesson, setIsOpenCreateLesson] = useState(false);
  const navigate = useNavigate();
  const [allLesson, setAllLesson] = useState<UserLessonInfo[]>([]);
  const [isOpenEditLesson, setIsOpenEditLesson] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const getAllLesson = async () => {
    try {
      const courseRef = await doc(db, DbsName.COURSE, `${courseId}`);
      const courseSnap = await getDoc(courseRef);

      setCourseDetails(courseSnap.data());

      const allLessonSnapshot = await getDocs(query(collection(db, DbsName.LESSON), where('courseID', '==', courseId)));
      const allLessonDoc: UserLessonInfo[] = [];
      allLessonSnapshot.forEach((doc: any) => {
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        allLessonDoc.push({
          id: doc.id,
          ...docData,
        });
      });

      allLessonDoc.sort((a: UserLessonInfo, b: UserLessonInfo) => b.lastModify.getTime() - a.lastModify.getTime());
      setAllLesson(allLessonDoc);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllLesson();
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

  const handleOnEditLesson = async (lesson: any) => {
    setSelectedLesson(lesson);
    setIsOpenEditLesson(true);
  };

  return (
    <div className="manage-lesson__container">
      {courseId && (
        <>
          <div className="all-lesson-info-container">
            <div
              onClick={() => {
                navigate(routePath.MANAGE_COURSE);
              }}
              style={{
                marginBottom: '3rem',
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

            <Button className="add-quiz" onClick={() => setIsOpenCreateLesson(true)}>
              Add new lesson <PlusCircleOutlined />
            </Button>

            <div className="title">
              Course: {Cookies.get('courseNameLol')} {Cookies.get('courseName')}
            </div>
            <div className="title">Total lesson(s): {allLesson.length}</div>
            {allLesson.map((lesson, index) => {
              return (
                <LessonInfo
                  key={index}
                  lesson={lesson}
                  actions={[
                    <Button key="edit-quiz" className="edit-btn" onClick={() => handleOnEditLesson(lesson)}>
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

          {isOpenCreateLesson && (
            <CreateLesson
              visible={isOpenCreateLesson}
              setIsOpenCreateLesson={setIsOpenCreateLesson}
              courseId={courseId}
              getAllLesson={getAllLesson}
            />
          )}

          {selectedLesson && (
            <EditLesson
              visible={isOpenEditLesson}
              setIsOpenCreateNewQuizModal={setIsOpenEditLesson}
              selectedLesson={selectedLesson}
              getAllLesson={getAllLesson}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageLesson;

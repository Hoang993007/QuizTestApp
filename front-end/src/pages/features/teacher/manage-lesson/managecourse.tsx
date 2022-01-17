/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'src/store/hooks';
import { ICourseInfo } from 'src/interfaces';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import CourseInfo from 'src/components/course-info';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import routePath from 'src/constants/routePath';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import CreateCourse from './create-course';
import EditCourse from './edit-course';

const ManageCourse: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const [allCourse, setAllCourse] = useState<ICourseInfo[]>([]);
  const [isOpenCreateCourse, setIsOpenCreateCourse] = useState(false);
  const [isOpenEditCourse, setIsOpenEditCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>();
  const navigate = useNavigate();

  const getAllCourse = async () => {
    try {
      const allCourseSnapshot = await getDocs(
        query(collection(db, DbsName.COURSE), where('classID', '==', user.classID)),
      );

      const allCourseDoc: ICourseInfo[] = [];
      allCourseSnapshot.forEach((doc: any) => {
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        allCourseDoc.push({
          id: doc.id,
          ...docData,
        });
      });

      allCourseDoc.sort((a: ICourseInfo, b: ICourseInfo) => b.lastModify.getTime() - a.lastModify.getTime());
      setAllCourse(allCourseDoc);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllCourse();
    }
  }, [user]);

  const handleOnView = (course: any) => {
    navigate(routePath.MANAGE_LESSON.replace(':courseId', course.id));
  };

  const handleOnDeleteCourse = async (course: any) => {
    try {
      const allLessonSnapshot = await getDocs(
        query(collection(db, DbsName.LESSON), where('courseName', '==', course.id)),
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

  const handleOnEditCourse = (course: any) => {
    setIsOpenEditCourse(true);
    setSelectedCourse(course);
  };

  return (
    <div className="manage-lesson__container">
      <div className="all-lesson-info-container">
        <Button className="add-quiz" onClick={() => setIsOpenCreateCourse(true)}>
          Create new course <PlusCircleOutlined />
        </Button>
      </div>

      <div className="title">Total course: {allCourse.length}</div>
      {allCourse.map((course, index) => {
        return (
          <CourseInfo
            key={index}
            course={course}
            actions={[
              <Button key="edit-quiz" className="edit-btn" onClick={() => handleOnEditCourse(course)}>
                Edit Course
              </Button>,
              <Button key="view-lesson" className="vie-btn" onClick={() => handleOnView(course)}>
                View Course
              </Button>,
              <Button key="delete-course" className="del-btn" onClick={() => handleOnDeleteCourse(course)}>
                Delete Course
              </Button>,
            ]}
          />
        );
      })}

      <CreateCourse
        visible={isOpenCreateCourse}
        setIsOpenCreateCourse={setIsOpenCreateCourse}
        getAllCourse={getAllCourse}
      />

      {selectedCourse && (
        <EditCourse
          visible={isOpenEditCourse}
          setIsOpenEditCourse={setIsOpenEditCourse}
          selectedCourse={selectedCourse}
          getAllCourse={getAllCourse}
        />
      )}
    </div>
  );
};

export default ManageCourse;

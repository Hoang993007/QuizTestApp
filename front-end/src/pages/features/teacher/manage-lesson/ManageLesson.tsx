import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateLesson from './create-lesson';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ICourseInfo } from 'src/interfaces';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import CourseInfo from 'src/components/course-info';

const ManageLesson: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const dispatch = useAppDispatch();
  const [allCourse, setAllCourse] = useState<ICourseInfo[]>([]);
  const [isOpenCreateLesson, setIsOpenCreateLesson] = useState(false);

  const getAllCourse = async () => {
    console.log('heya');
    try {
      console.log('heya');
      const allCourseSnapshot = await getDocs(query(collection(db, DbsName.COURSE)));
      if (allCourseSnapshot.empty) {
        console.log('empty');
      };
      const allCourseDoc : ICourseInfo[] = [];
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
    } catch (error:any) {
      console.error(error);
    };
  };

  const navigateToCourse = (course: any) => {
    
    //navigate(routePath.);
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllCourse();
    }
  }, [user]);

  return (
    <div className="manage-lesson__container">
      <div className="all-lesson-info-container">
        <Button className="add-quiz" onClick={() => setIsOpenCreateLesson(true)}>
          Add new lesson <PlusCircleOutlined />
        </Button>
      </div>

      <div className="title">Total quiz: {allCourse.length}</div>
      {allCourse.map((course, index) => {
          return (
            <CourseInfo 
              key={index}
              course={course}
              actions={[
                <Button key="delete-quiz" className="del-btn">
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

export default ManageLesson;

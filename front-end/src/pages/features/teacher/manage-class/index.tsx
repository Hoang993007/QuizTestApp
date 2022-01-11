import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { DbsName } from 'src/constants/db';

import { useAppSelector } from 'src/store/hooks';
import './ManageClass.scss';
import { classesRef, db } from 'src/firebase/firebase';
const ManageClass = () => {
  const user = useAppSelector((state) => state.account.user);
  const [classMember, setClassMember] = useState<any[]>([]);
  const [classes, setClasses] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const getClassMember = async () => {
      const classMemberArr: any[] = [];
      const getClasses = async () => {
        console.log('getDoc');
        const docSnap = await getDocs(classesRef);
        const classesData: any[] = [];
        docSnap.forEach((doc) => {
          classesData.push({
            label: doc.data().name,
            value: doc.id,
          });
        });
        setClasses(classesData);
      };
      getClasses();
      console.log('getDoc');
      const classMemberSnapshot = await getDocs(
        query(collection(db, DbsName.USER), where('classID', '==', user.classID), where('role', '==', 0)),
      );

      classMemberSnapshot.forEach(async (docSnap) => {
        classMemberArr.push({
          userID: docSnap.id,
          ...docSnap.data(),
        });
      });

      setClassMember(classMemberArr);
    };

    if (user.classID) getClassMember();
  }, [user.classID]);

  return (
    <>
      <div className="manage-class__container">
        <div className="title">
          <h2>
            <span className="field-title">Class</span>{' '}
            {classes.find((classInfo) => classInfo.value === user.classID)?.label}
          </h2>
          <h3>
            <span className="field-title">Number of students</span> {classMember.length}
          </h3>
        </div>
        <table>
          <thead>
            <tr>
              <th rowSpan={2} className="col-Stt">
                No.
              </th>
              <th rowSpan={4} className="col-Name">
                Name
              </th>
              <th rowSpan={4} className="col-Name"></th>
            </tr>
          </thead>
          <tbody>
            {classMember.length > 0 &&
              classMember.map((student, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{student.fullname}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="pagination">
          <button>{'<<'}</button>
          <button>{'<'}</button>
          <div>
            <span>
              Page <strong>1 of 1</strong>
            </span>
          </div>
          <button>{'>'}</button>
          <button>{'>>'}</button>{' '}
        </div>
      </div>
    </>
  );
};

export default ManageClass;

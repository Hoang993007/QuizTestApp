/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getClassMember = async () => {
      const classMemberArr: any[] = [];
      const getClasses = async () => {
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

      const classMemberSnapshot = await getDocs(
        query(collection(db, DbsName.USER), where('classID', '==', user.classID), where('role', '==', 0)),
      );

      classMemberSnapshot.forEach((docSnap) => {
        classMemberArr.push({
          userID: docSnap.id,
          ...docSnap.data(),
        });
      });

      for (let i = 0; i < classMemberArr.length; i++) {
        const allResultsSnapshot = await getDocs(
          query(collection(db, DbsName.RESULT), where('userID', '==', classMemberArr[i].userID)),
        );

        const userResult = {
          numOfQuiz: allResultsSnapshot.size,
          correctPercent: 0,
        };
        allResultsSnapshot.forEach((el) => {
          userResult.correctPercent += el.data().score / el.data().totalScore;
        });
        userResult.correctPercent = userResult.correctPercent
          ? (userResult.correctPercent / userResult.numOfQuiz) * 100
          : 0;

        classMemberArr[i].result = userResult;
      }

      classMemberArr.sort((member1, member2) => {
        if (member2.result.numOfQuiz !== member1.result.numOfQuiz) {
          return member2.result.numOfQuiz - member1.result.numOfQuiz;
        } else return member2.result.correctPercent - member1.result.correctPercent;
      });

      setClassMember(classMemberArr);
      setIsLoading(false);
    };

    if (user.classID) getClassMember();
  }, [user.classID]);

  return (
    <>
      <div className="manage-class__container" style={{ width: '90%', maxWidth: '70rem' }}>
        <div className="title">
          <h2>
            <span className="field-title">Class</span>{' '}
            {classes.find((classInfo) => classInfo.value === user.classID)?.label}
          </h2>
          <h3>
            <span className="field-title">Number of students</span> {isLoading ? 'Loading...' : classMember.length}
          </h3>
        </div>
        <table
          style={{
            width: '100%',
          }}
        >
          <thead>
            <tr>
              <th
                className=""
                style={{
                  width: '10%',
                }}
              >
                No.
              </th>

              <th className="">Name</th>

              <th
                className=""
                style={{
                  width: '20%',
                  textAlign: 'right',
                }}
              >
                Number of quizzes done
              </th>

              <th
                className=""
                style={{
                  width: '30%',
                  textAlign: 'right',
                  paddingRight: '3rem',
                }}
              >
                Correct percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {classMember.length > 0 &&
              classMember.map((student, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td
                      style={{
                        paddingLeft: '5rem',
                      }}
                    >
                      {student.fullname}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      {student.result.numOfQuiz}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      {student.result.correctPercent.toFixed(2)}%
                    </td>
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

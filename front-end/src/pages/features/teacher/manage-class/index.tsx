import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppSelector } from 'src/store/hooks';
import './ManageClass.scss';

const ManageClass = () => {
  const user = useAppSelector((state) => state.account.user);
  const [classMember, setClassMember] = useState<any[]>([]);

  useEffect(() => {
    const getClassMember = async () => {
      const classMemberArr: any[] = [];

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
      {classMember.length > 0 &&
        classMember.map((student) => {
          return <div key={student.userID}>{student.fullname}</div>;
        })}
    </>
  );
};

export default ManageClass;

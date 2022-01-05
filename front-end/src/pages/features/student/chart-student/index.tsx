import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'src/store/hooks';
import { collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './styles.scss';

Chart.register(...registerables);

const ChartStudent: React.FC = () => {
  const user = useAppSelector((state) => state.account.user);
  const [userClasses, setUserClasses] = useState<any>();
  const [userResultData, setUserResultData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const getAllUserResults = async () => {
    const labels: any = [];
    const datas: any = [];

    try {
      console.log('getDoc');
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));
      const allResultData: any = [];
      allResultSnapshot.forEach((result: any) => {
        const resultData = result.data();
        resultData.date = resultData.date.toDate();
        allResultData.push(resultData);
      });

      allResultData.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

      console.log('getDoc');
      const allQuizSnapshot = await getDocs(query(collection(db, DbsName.QUIZ), where('classID', '==', user.classID)));
      const allQuizData: any = [];
      allQuizSnapshot.forEach((quiz: any) =>
        allQuizData.push({
          data: quiz.data(),
          id: quiz.id,
        }),
      );

      for (let i = 0; i < allResultData.length; i++) {
        const quiz = allQuizData.find((quizE: any) => quizE.id === allResultData[i].quizID);
        if (quiz) {
          labels.push(quiz.data.name);
          datas.push((allResultData[i].score / allResultData[i].totalScore) * 100);
        }
      }

      setUserResultData({
        labels,
        datasets: [
          {
            label: 'Score on a scale of 100 points',
            fill: false,
            borderColor: 'red',
            borderWidth: 1,
            data: datas,
          },
        ],
      });
    } catch (error: any) {}
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllUserResults();
    }
  }, [user]);

  const getClasses = async () => {
    try {
      const classDocRef = await doc(db, DbsName.CLASS, user.classID);
      console.log('getDoc');
      const classDocSnap = await getDoc(classDocRef);

      setUserClasses(classDocSnap.data());
    } catch (error) {}
  };

  useEffect(() => {
    if (user.accessToken) {
      getClasses();
    }
  }, [user]);

  return (
    <>
      {user.accessToken && user.fullname && userClasses && (
        <div className="container-chart">
          <h2>
            <strong>User infomation</strong>
          </h2>
          <div className="info-user">
            <p>Name: {user.fullname}</p>
            <p>Class:{userClasses.name} </p>
          </div>
          <h2>
            <br />
            <strong>Overall Result Chart</strong>
          </h2>
          {userResultData.labels.length <= 0 && <div className="no-test-found">You haven{"'"}t done any test</div>}
          {userResultData.labels.length > 0 && (
            <div className="chart">
              <Line data={userResultData}></Line>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChartStudent;

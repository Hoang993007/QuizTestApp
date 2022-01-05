/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { handleManageQuiz } from 'src/store/quiz';

const QuizResult = () => {
  const quiz = useAppSelector((state) => state.quiz.manageQuizCurQuiz);
  const dispatch = useAppDispatch();
  const { id: quizID } = useParams();
  const [allQuizResult, setAllQuizResult] = useState<any[]>([]);

  useEffect(() => {
    const getQuiz = async () => {
      const quizRef = await doc(db, DbsName.QUIZ, `${quizID}`);
      console.log('get quiz');
      const quizSnap = await getDoc(quizRef);
      dispatch(handleManageQuiz(quizSnap));
    };

    const getQuizResult = async () => {
      const quizResultTmp: any[] = [];

      console.log('get all quiz result');
      const allQuizResultSnapshot: any = await getDocs(
        query(collection(db, DbsName.RESULT), where('quizID', '==', quiz.id)),
      );

      allQuizResultSnapshot.forEach(async (quizResult: any) => {
        quizResultTmp.push({ result: quizResult.data() });
      });

      for (let i = 0; i < quizResultTmp.length; i++) {
        const userRef = await doc(db, DbsName.USER, quizResultTmp[i].result.userID);
        console.log('getDoc');
        const userSnap = await getDoc(userRef);

        quizResultTmp[i].user = userSnap.data();
        quizResultTmp[i].userID = userSnap.id;
      }

      setAllQuizResult(quizResultTmp);
    };

    quiz.id ? getQuizResult() : getQuiz();
  }, [quiz]);

  return (
    <>
      {allQuizResult.length > 0 &&
        allQuizResult.map((el, index) => {
          return (
            <div key={index}>
              <div>{el.user.fullname}</div>
              <div>
                {el.result.score}/{el.result.totalScore}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default QuizResult;

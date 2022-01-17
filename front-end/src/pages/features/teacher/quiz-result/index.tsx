/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { handleManageQuiz } from 'src/store/quiz';
import './style.scss';
const QuizResult = () => {
  const quiz = useAppSelector((state) => state.quiz.manageQuizCurQuiz);
  const dispatch = useAppDispatch();
  const { id: quizID } = useParams();
  const [allQuizResult, setAllQuizResult] = useState<any[]>([]);

  useEffect(() => {
    const getQuiz = async () => {
      const quizRef = await doc(db, DbsName.QUIZ, `${quizID}`);
      const quizSnap = await getDoc(quizRef);
      dispatch(handleManageQuiz(quizSnap));
    };

    const getQuizResult = async () => {
      const quizResultTmp: any[] = [];

      const allQuizResultSnapshot: any = await getDocs(
        query(collection(db, DbsName.RESULT), where('quizID', '==', quiz.id)),
      );

      allQuizResultSnapshot.forEach(async (quizResult: any) => {
        quizResultTmp.push({ result: quizResult.data() });
      });

      for (let i = 0; i < quizResultTmp.length; i++) {
        const userRef = await doc(db, DbsName.USER, quizResultTmp[i].result.userID);
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
      <div className="manage-quiz-result__container">
        <div className="title">
          <h2>
            <span className="field-title">Quiz</span>
            <span>{quiz.name}</span>
          </h2>
          <div>
            <span className="field-title">Number of questions</span>
            <span>{quiz.numberOfQuestion}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th className="col-Stt">No.</th>
              <th className="col-Name">Name</th>
              <th className="col-Score">Score</th>
            </tr>
          </thead>

          <tbody>
            {allQuizResult.length > 0 &&
              allQuizResult.map((el, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{el.user.fullname}</td>
                    <td>{el.result.score}</td>
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

export default QuizResult;

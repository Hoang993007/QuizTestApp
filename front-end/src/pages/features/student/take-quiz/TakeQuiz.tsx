/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import routePath from 'src/constants/routePath';
import './styles.scss';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IQuizResult } from 'src/interfaces';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { handleTakeQuiz } from 'src/store/quiz';
import Cookies from 'js-cookie';
import { cookieName } from 'src/constants/cookieNameVar';
import QuizInfo, { UserQuizInfo } from 'src/components/quiz-info';
import { Button } from 'antd';
import QuizResult from './quiz-result';
import classNames from 'classnames';

const TakeQuiz: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [allQuiz, setAllQuiz] = useState<UserQuizInfo[]>([]);
  const [isOpenQuizResultModal, setIsOpenQuizResultModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>();

  const getAllUserQuiz = async () => {
    try {
      /**
       * Get all user results
       */
      const allResultDoc: IQuizResult[] = [];
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));

      allResultSnapshot.forEach((doc: any) => {
        allResultDoc.push(doc.data());
      });

      /**
       * Get all quiz
       */
      const allQuizSnapshot = await getDocs(query(collection(db, DbsName.QUIZ), where('classID', '==', user.classID)));

      const allQuizDoc: UserQuizInfo[] = [];
      allQuizSnapshot.forEach((doc: any) => {
        const quizUserResult = allResultDoc.filter((result) => result.quizID === doc.id);

        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        if (quizUserResult) {
          allQuizDoc.push({
            id: doc.id,
            ...docData,
            userResult: quizUserResult[0],
          });
        }
      });

      allQuizDoc.sort((a: UserQuizInfo, b: UserQuizInfo) => b.lastModify.getTime() - a.lastModify.getTime());

      setAllQuiz(allQuizDoc);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllUserQuiz();
    }
  }, [user]);

  useEffect(() => {
    const currentQuiz = Cookies.get(cookieName.CURRENT_QUIZ);
    if (currentQuiz) {
      dispatch(handleTakeQuiz(JSON.parse(currentQuiz)));
    }
  });

  const takeQuiz = (quiz: UserQuizInfo) => {
    dispatch(handleTakeQuiz(quiz));
    navigate(routePath.QUIZ);
  };

  const takeQuizAction = (quiz: any) => [
    <div key="quiz-result" className="result-text">
      Current result:
      <div className="result-text-score">
        {quiz.userResult?.score || quiz.userResult?.score === 0 ? quiz.userResult?.score : '--'}/
        {quiz.userResult?.totalScore ? quiz.userResult?.totalScore : '--'}
      </div>
    </div>,
    <Button
      key="quiz-result-detail"
      className={classNames('result-btn', quiz.userResult?.score || quiz.userResult?.score === 0 ? '' : 'btn-disabled')}
      onClick={() => {
        setIsOpenQuizResultModal(true);
        setSelectedQuiz(quiz);
      }}
      disabled={quiz.userResult?.score || quiz.userResult?.score === 0 ? false : true}
    >
      Quiz Results
    </Button>,
    <Button key="start-quiz" onClick={() => takeQuiz(quiz)}>
      Start Quiz
    </Button>,
  ];

  return (
    <>
      {Cookies.get(cookieName.CURRENT_QUIZ) && <Navigate to={routePath.QUIZ} />}

      {isOpenQuizResultModal && (
        <QuizResult
          visible={isOpenQuizResultModal}
          setIsOpenQuizResultModal={setIsOpenQuizResultModal}
          quiz={selectedQuiz}
        />
      )}

      {allQuiz.length <= 0 && <div className="no-quiz-created">You have no quiz to do</div>}

      {allQuiz.length > 0 && (
        <div className="take-test__container">
          {allQuiz[0] && (
            <>
              <div className="title new-quiz-title">NEW QUIZ!</div>

              <QuizInfo quiz={allQuiz[0]} actions={takeQuizAction(allQuiz[0])} />
            </>
          )}

          {allQuiz.length > 1 && (
            <>
              <div className="title other-quiz-title">OTHER QUIZZES</div>

              <div className="all-quiz-info-container">
                {allQuiz.map((quiz, index) => {
                  if (index === 0) return;

                  return <QuizInfo key={index} quiz={quiz} actions={takeQuizAction(quiz)} />;
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TakeQuiz;

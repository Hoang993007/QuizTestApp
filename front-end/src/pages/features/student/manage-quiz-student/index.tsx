/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import './styles.scss';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IQuizInfo, IQuizResult } from 'src/interfaces';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import routePath from 'src/constants/routePath';
import { handleManageQuiz } from 'src/store/quiz';
import CreateQuizStudent from './components/create-quiz';
import classNames from 'classnames';
import { handleTakeQuiz } from 'src/store/quiz';
import QuizInfo, { UserQuizInfo } from 'src/components/quiz-info';
import QuizResult from '../take-quiz/quiz-result';
import { LocalStorageKeys } from 'src/constants/localStoragekey';

const ManageTestStudent: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);
  const dispatch = useAppDispatch();
  const [allQuiz, setAllQuiz] = useState<IQuizInfo[]>([]);
  const [isOpenCreateNewQuizModal, setIsOpenCreateNewQuizModal] = useState(false);
  const navigate = useNavigate();
  const [isOpenQuizResultModal, setIsOpenQuizResultModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>();

  const getAllQuiz = async () => {
    try {
      const allResultDoc: IQuizResult[] = [];
      const allResultSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('userID', '==', user.uid)));
      const allQuizSnapshot = await getDocs(query(collection(db, DbsName.QUIZ), where('classID', '==', user.uid)));
      allResultSnapshot.forEach((doc: any) => {
        allResultDoc.push(doc.data());
      });

      const allQuizDoc: IQuizInfo[] = [];
      allQuizSnapshot.forEach((doc: any) => {
        const quizUserResult = allResultDoc.filter((result) => result.quizID === doc.id);
        const docData = doc.data();
        docData.lastModify = docData.lastModify.toDate();

        allQuizDoc.push({
          id: doc.id,
          ...docData,
          userResult: quizUserResult[0],
        });
      });

      allQuizDoc.sort((a: IQuizInfo, b: IQuizInfo) => b.lastModify.getTime() - a.lastModify.getTime());

      setAllQuiz(allQuizDoc);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.accessToken) {
      getAllQuiz();
    }
  }, [user]);

  const handleOnDeleteQuiz = async (quiz: any) => {
    try {
      const allQuizQuesSnapshot = await getDocs(
        query(collection(db, DbsName.QUESTION), where('quizID', '==', quiz.id)),
      );
      allQuizQuesSnapshot.forEach((ques) => {
        deleteDoc(doc(db, DbsName.QUESTION, ques.id));
      });

      deleteDoc(doc(db, DbsName.QUIZ, quiz.id));

      // Delete all quiz results

      const allResultsSnapshot = await getDocs(query(collection(db, DbsName.RESULT), where('quizID', '==', quiz.id)));
      allResultsSnapshot.forEach((result) => {
        deleteDoc(doc(db, DbsName.RESULT, result.id));
      });

      setAllQuiz(allQuiz.filter((quizE) => quizE.id !== quiz.id));

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete quiz successfully', '');
    } catch (error: any) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Delete quiz failed', '');
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleOnEditQuiz = (quiz: any) => {
    dispatch(handleManageQuiz(quiz));
    navigate(routePath.EDIT_QUIZ.replace(':id', quiz.id));
  };

  useEffect(() => {
    const currentQuiz = localStorage.getItem(LocalStorageKeys.CURRENT_QUIZ);
    if (currentQuiz) {
      dispatch(handleTakeQuiz(JSON.parse(currentQuiz)));
    }
  }, []);

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
      style={{
        marginBottom: '1rem',
      }}
    >
      Quiz Results
    </Button>,
    <Button
      key="edit-quiz"
      className="edi-btn"
      onClick={() => handleOnEditQuiz(quiz)}
      style={{
        marginBottom: '1rem',
      }}
    >
      Edit Quiz
    </Button>,
    <Button key="start-quiz" className="join-btn" onClick={() => takeQuiz(quiz)}>
      Start Quiz
    </Button>,
    <Button key="delete-quiz" className="del-btn" onClick={() => handleOnDeleteQuiz(quiz)}>
      Delete Quiz
    </Button>,
  ];

  return (
    <div className="manage-test__container">
      <div className="all-quiz-info-container">
        <div className="title">MY QUIZ</div>

        <Button className="add-quiz" onClick={() => setIsOpenCreateNewQuizModal(true)}>
          Add new quiz <PlusCircleOutlined />
        </Button>

        <div className="title">Total quiz: {allQuiz.length}</div>
        {allQuiz.map((quiz, index) => {
          return <QuizInfo key={index} quiz={quiz} actions={takeQuizAction(quiz)} />;
        })}
      </div>

      <CreateQuizStudent
        visible={isOpenCreateNewQuizModal}
        setIsOpenCreateNewQuizModal={setIsOpenCreateNewQuizModal}
        getAllQuiz={getAllQuiz}
      />

      <QuizResult
        visible={isOpenQuizResultModal}
        setIsOpenQuizResultModal={setIsOpenQuizResultModal}
        quiz={selectedQuiz}
      />
    </div>
  );
};

export default ManageTestStudent;

/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from 'antd/lib/modal/Modal';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { UserQuizInfo } from 'src/components/quiz-info';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import correctIcon from 'src/assets/icons/correct-icon.png';
import wrongIcon from 'src/assets/icons/wrong-icon.png';
import './styles.scss';

const QuizResult: React.FC<{
  visible: boolean;
  setIsOpenQuizResultModal: React.Dispatch<React.SetStateAction<boolean>>;
  quiz: UserQuizInfo;
}> = ({ visible, setIsOpenQuizResultModal, quiz }) => {
  const [resultDetails, setResultDetails] = useState<any[]>([]);

  useEffect(() => {
    const getResultDetails = async () => {
      const resultDetailsTmp: any[] = [];

      if (quiz && quiz?.userResult) {
        console.log(`get all quiz's ques`);
        const allQuesSnapshot = await getDocs(query(collection(db, DbsName.QUESTION), where('quizID', '==', quiz.id)));

        allQuesSnapshot.forEach((quesDoc: any) => {
          resultDetailsTmp.push({
            correct: quiz?.userResult?.resultDetails.find((el) => el.quesID === quesDoc.id).correct,
            quesDetails: quesDoc.data(),
          });

          if (resultDetailsTmp.length === allQuesSnapshot.size) {
            setResultDetails(resultDetailsTmp);
          }
        });
      }
    };

    getResultDetails();
  }, [quiz]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenQuizResultModal(false)}
      className="quiz-result-modal"
      title={<div className={'form__title'}>RESULT</div>}
      // closeIcon={hideModal && <img onClick={hideModal} src={CloseIcon} alt="close-icon" />}
      width={'60rem'}
      maskClosable={false}
      // description={description}
      closable={true}
      confirmLoading={true}
      centered={true}
      footer={<></>}
    >
      {resultDetails.map((el) => {
        const correctAnswer =
          el.quesDetails.correct_ans === 1
            ? el.quesDetails.ans_1
            : el.quesDetails.correct_ans === 1
            ? el.quesDetails.ans_1
            : el.quesDetails.correct_ans === 1
            ? el.quesDetails.ans_1
            : el.quesDetails.ans_1;

        return (
          <>

            <div className='question-container'>
              <span>Question: {el.quesDetails.question}</span>
            </div>
            {el.correct == 1 &&
            <div className='result-container'>
              <span>Correct answer:</span>
              <br></br>
              <span className='kotae'>
                {correctAnswer}
              </span>
            </div>}
            {el.correct == 0 &&
            <div className='result-container-wrong'>
              <span>Correct answer:</span>
              <br></br>
              <span className='kotae'>
                {correctAnswer}
              </span>
            </div>}
          </>
        );
      })}
    </Modal>
  );
};

export default QuizResult;

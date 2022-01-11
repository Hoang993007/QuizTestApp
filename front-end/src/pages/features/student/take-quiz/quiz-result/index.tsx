/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from 'antd/lib/modal/Modal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { UserQuizInfo } from 'src/components/quiz-info';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import correctIcon from 'src/assets/icons/correct-icon.png';
import wrongIcon from 'src/assets/icons/wrong-icon.png';
import './styles.scss';
import classnames from 'classnames';

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
            ...quiz?.userResult?.resultDetails.find((el) => el.quesID === quesDoc.id),
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
        return (
          <>
            <div className="question-container">
              <span>
                <img className="icon" src={el.correct ? correctIcon : wrongIcon} alt={el.correct} />{' '}
                {el.quesDetails.question}
              </span>
            </div>

            <div className="result-container">
              <div
                className={classnames(
                  Number(el.quesDetails.correct_ans) === 1 ? 'correct-ans' : '',
                  el.wrongAns && el.wrongAns === 1 ? 'wrong-ans' : '',
                )}
              >
                A. {el.quesDetails.ans_1}
              </div>
              <div
                className={classnames(
                  Number(el.quesDetails.correct_ans) === 2 ? 'correct-ans' : '',
                  el.wrongAns && el.wrongAns === 2 ? 'wrong-ans' : '',
                )}
              >
                B. {el.quesDetails.ans_2}
              </div>
              <div
                className={classnames(
                  Number(el.quesDetails.correct_ans) === 3 ? 'correct-ans' : '',
                  el.wrongAns && el.wrongAns === 3 ? 'wrong-ans' : '',
                )}
              >
                C. {el.quesDetails.ans_3}
              </div>
              <div
                className={classnames(
                  Number(el.quesDetails.correct_ans) === 4 ? 'correct-ans' : '',
                  el.wrongAns && el.wrongAns === 4 ? 'wrong-ans' : '',
                )}
              >
                D. {el.quesDetails.ans_4}
              </div>
            </div>
          </>
        );
      })}
    </Modal>
  );
};

export default QuizResult;

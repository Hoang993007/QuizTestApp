/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, query, where, updateDoc, doc, getDoc, deleteDoc, addDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import './index.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { useParams } from 'react-router-dom';
import { handleManageQuiz } from 'src/store/quiz';
import { AiFillDelete } from 'react-icons/ai';

const EditQuiz: React.FC = () => {
  const quiz = useAppSelector((state) => state.quiz.manageQuizCurQuiz);
  const { id: quizID } = useParams();
  const dispatch = useAppDispatch();

  const [allQuestion, setAllQuestion] = useState<any>([]);

  const [quizDetails, setQuizDetails] = useState({ ...quiz });
  const quizName = useRef<any>();

  const getQuestions = async () => {
    try {
      const allQuestionSnapshot = await getDocs(
        query(collection(db, DbsName.QUESTION), where('quizID', '==', quiz.id)),
      );

      const allQuestionData: any = [];
      allQuestionSnapshot.forEach((q: any) => {
        const questData = q.data();
        allQuestionData.push({ ...questData, id: q.id });
      });

      setAllQuestion(allQuestionData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getQuiz = async () => {
      const quizRef = await doc(db, DbsName.QUIZ, `${quizID}`);
      const quizSnap = await getDoc(quizRef);
      dispatch(handleManageQuiz({ id: quizSnap.id, ...quizSnap.data() }));
    };

    quiz.id ? getQuestions() : getQuiz();
    setQuizDetails({ ...quiz });
  }, [quiz]);

  const deleteQuestion = async (id: any, deleteQuesIndex: number) => {
    if (id === 'new') {
      const newAllQuestion = allQuestion.filter((el: any, index: number) => index !== deleteQuesIndex);
      setAllQuestion(newAllQuestion);
      return;
    }

    if (allQuestion && allQuestion.length > 1) {
      try {
        const newAllQuestion = allQuestion.filter((el: any) => el.id !== id);
        setAllQuestion(newAllQuestion);

        const questDocRef = doc(db, DbsName.QUESTION, id);
        await deleteDoc(questDocRef);

        openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete successfully!', '');

        setQuizDetails((prev: any) => ({ ...prev, numberOfQuestion: newAllQuestion.length }));
      } catch (error) {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error when delete questions!', '');
      }
    } else {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Cant delete more!', '');
    }
  };

  const addQuestion = () => {
    const newAllQuestion = [...allQuestion];
    newAllQuestion.push({
      id: 'new',
      question: '',
      ans_1: '',
      ans_2: '',
      ans_3: '',
      ans_4: '',
      correct_ans: '1',
    });
    setAllQuestion(newAllQuestion);

    setQuizDetails((prev: any) => ({ ...prev, numberOfQuestion: prev.numberOfQuestion + 1 }));
  };

  const submitChange = async () => {
    try {
      const quizDocRef = doc(db, DbsName.QUIZ, quiz.id);

      allQuestion.forEach(async (quest: any, index: any) => {
        if (quest.id == 'new') {
          if (!quest.question || !quest.ans_1 || !quest.ans_2 || !quest.ans_3 || !quest.ans_4 || !quest.correct_ans) {
            openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Row ${index + 1} cannot be null`, '');
            return;
          }

          const newRow = await addDoc(collection(db, DbsName.QUESTION), {
            question: quest.question,
            ans_1: quest.ans_1,
            ans_2: quest.ans_2,
            ans_3: quest.ans_3,
            ans_4: quest.ans_4,
            correct_ans: quest.correct_ans,
            quizID: quizID,
          });

          quest.Id = newRow.id;
          quest.edited = '0';

          await updateDoc(quizDocRef, {
            numberOfQuestion: allQuestion.length,
          });

          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Updated question successfully', '');
        } else if (quest.edited === '1') {
          const questInfoDocRef = doc(db, DbsName.QUESTION, quest.id);
          await updateDoc(questInfoDocRef, {
            question: quest.question,
            ans_1: quest.ans_1,
            ans_2: quest.ans_2,
            ans_3: quest.ans_3,
            ans_4: quest.ans_4,
            correct_ans: quest.correct_ans,
          });
          quest.edited = '0';
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Updated question successfully', '');
        }
      });

      // check input valid
      if (quizDetails.timeLimit == 0) {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Time limit is valid`, '');
        return;
      }
      if (quizDetails.name == '' || quizDetails.description == '') {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Name or description is valid`, '');
        return;
      }

      //check name exist
      if (quizDetails.name !== quiz.name) {
        const checkQuizName = await getDocs(query(collection(db, DbsName.QUIZ), where('name', '==', quizDetails.name)));

        if (!checkQuizName.empty) {
          // update quiz detail
          await updateDoc(quizDocRef, {
            timeLimit: quizDetails.timeLimit,
            description: quizDetails.description,
          });

          openCustomNotificationWithIcon(
            NOTIFICATION_TYPE.ERROR,
            "The quiz's name was updated was not updated due to a duplicate !",
            '',
          );

          return;
        }
      }

      // update quiz detail
      await updateDoc(quizDocRef, {
        name: quizDetails.name,
        timeLimit: quizDetails.timeLimit,
        description: quizDetails.description,
      });

      const name = quizName.current;
      name.innerHTML = `${quizDetails.name}`;
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update successfully !', '');
    } catch (error) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating questions !', '');
    }
  };

  return (
    <div className="edit-quiz__container">
      <div className="title">
        <div className="name-test">
          <h2>
            Editing Quiz: <strong ref={quizName}>{quiz.name}</strong>
            {/* <a className="icon-test" onClick={() => EditQuizDetail()}><AiTwotoneEdit color='#327a81' /></a> */}
          </h2>
        </div>
      </div>

      {quiz && (
        <div className="detail-quiz">
          <div className="element-detail">
            <div className="form-label">Name</div>
            <input
              type="text"
              className="form-control"
              name="nameQuiz"
              id="nameQuiz"
              defaultValue={quizDetails.name}
              onChange={(e) => {
                setQuizDetails((prev: any) => ({ ...prev, name: e.target.value }));
              }}
            />
          </div>

          <div className="element-detail">
            <div className="form-label">Time Limit (minute)</div>
            <input
              type="text"
              className="form-control"
              value={quizDetails.timeLimit / 60}
              onChange={(e) => {
                if (isNaN(quizDetails.timeLimit)) quizDetails.timeLimit = 0;
                setQuizDetails((prev: any) => ({ ...prev, timeLimit: parseInt(e.target.value) * 60 }));
              }}
            />
          </div>

          <div className="element-detail">
            <div className="form-label">Description</div>
            <TextareaAutosize
              defaultValue={quizDetails.description}
              onChange={(e) => {
                setQuizDetails((prev: any) => ({ ...prev, description: e.target.value }));
              }}
            />
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th rowSpan={2} className="col-No">
              No.
            </th>
            <th rowSpan={2} className="col-Question">
              Questions
            </th>
            <th colSpan={4} className="col-Answer">
              Answers
            </th>
            <th rowSpan={2} className="col-Corect-Answer">
              Correct Answer
            </th>
            <th rowSpan={2} className="col-delete"></th>
          </tr>
          <tr>
            <th className="col-Answer">1</th>
            <th className="col-Answer">2</th>
            <th className="col-Answer">3</th>
            <th className="col-Answer">4</th>
          </tr>
        </thead>

        <tbody>
          {allQuestion.map((question: any, index: any) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <TextareaAutosize
                    value={question.question}
                    onChange={(e) => {
                      question.question = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  />
                </td>

                <td>
                  <TextareaAutosize
                    value={question.ans_1}
                    onChange={(e) => {
                      question.ans_1 = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  />
                </td>
                <td>
                  <TextareaAutosize
                    value={question.ans_2}
                    onChange={(e) => {
                      question.ans_2 = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  />
                </td>
                <td>
                  <TextareaAutosize
                    value={question.ans_3}
                    onChange={(e) => {
                      question.ans_3 = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  />
                </td>
                <td>
                  <TextareaAutosize
                    value={question.ans_4}
                    onChange={(e) => {
                      question.ans_4 = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  />
                </td>
                <td>
                  <select
                    name="CorrectAnswer"
                    id="correct-answer"
                    value={question.correct_ans}
                    onChange={(e) => {
                      question.correct_ans = e.target.value;
                      question.edited = '1';
                      setAllQuestion([...allQuestion]);
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </td>

                <td>
                  <a
                    id="btn-delete"
                    data-id={question.Id}
                    data-key={index}
                    onClick={() => deleteQuestion(question.id, index)}
                  >
                    <AiFillDelete color="red" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="footer">
        <div className="f-left">
          <button
            className="btn-add"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => addQuestion()}
          >
            Add new Question
          </button>
        </div>
        <div className="f-right">
          <button
            className="btn-submit"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => submitChange()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;

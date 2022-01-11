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
  const [data, setData] = useState([
    { Id: '', Question: '', Answer1: '', Answer2: '', Answer3: '', Answer4: '', CorrectAnswer: '', Edit: '' },
  ]);
  const tbodyRef = useRef<any>();
  const getQuestions = async () => {
    try {
      console.log('getDoc');
      const allQuestionSnapshot = await getDocs(
        query(collection(db, DbsName.QUESTION), where('quizID', '==', quiz.id)),
      );

      const allQuestionData: any = [];
      allQuestionSnapshot.forEach((q: any) => {
        const questData = q.data();
        const quest = {
          Id: q.id,
          Question: questData.question,
          Answer1: questData.ans_1,
          Answer2: questData.ans_2,
          Answer3: questData.ans_3,
          Answer4: questData.ans_4,
          CorrectAnswer: questData.correct_ans,
          Edit: '0',
        };
        allQuestionData.push(quest);
      });
      setData(allQuestionData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getQuiz = async () => {
      const quizRef = await doc(db, DbsName.QUIZ, `${quizID}`);
      console.log('getDoc');
      const quizSnap = await getDoc(quizRef);
      dispatch(handleManageQuiz({ id: quizSnap.id, ...quizSnap.data() }));
    };

    quiz.id ? getQuestions() : getQuiz();
  }, [quiz]);

  const QuestionDelete = async (e: any, key: any) => {
    if (data.length > 1) {
      try {
        const arr = [...data.slice(0, key), ...data.slice(key + 1)];
        console.log(arr);

        setData(arr);
        const questDocRef = doc(db, DbsName.QUESTION, e);
        await deleteDoc(questDocRef);
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete successfully!', '');
      } catch (error) {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error when delete questions!', '');
      }
    } else {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Cant delete more!', '');
    }
    console.log(data);
  };

  const addQuestion = () => {
    const newData = [...data];
    const newRow = {
      Id: 'new',
      Question: '',
      Answer1: '',
      Answer2: '',
      Answer3: '',
      Answer4: '',
      CorrectAnswer: '',
      Edit: '0',
    };
    newData.push(newRow);
    setData(newData);
  };

  const submitChange = async () => {
    try {
      data.forEach(async (quest, index) => {
        if (quest.Id == 'new') {
          console.log(index);
          if (
            quest.Question == '' ||
            quest.Answer1 == '' ||
            quest.Answer2 == '' ||
            quest.Answer3 == '' ||
            quest.Answer4 == '' ||
            quest.CorrectAnswer == ''
          ) {
            openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Row ${index + 1} cannot be null`, '');
            return;
          }
          const newRow = await addDoc(collection(db, DbsName.QUESTION), {
            question: quest.Question,
            ans_1: quest.Answer1,
            ans_2: quest.Answer2,
            ans_3: quest.Answer3,
            ans_4: quest.Answer4,
            correct_ans: quest.CorrectAnswer,
            quizID: quizID,
          });
          quest.Id = newRow.id;
          quest.Edit = '0';
          setData([...data]);
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update successfully', '');
        } else if (quest.Edit == '1') {
          const questInfoDocRef = doc(db, DbsName.QUESTION, quest.Id);
          await updateDoc(questInfoDocRef, {
            question: quest.Question,
            ans_1: quest.Answer1,
            ans_2: quest.Answer2,
            ans_3: quest.Answer3,
            ans_4: quest.Answer4,
            correct_ans: quest.CorrectAnswer,
          });
          quest.Edit = '0';
          setData([...data]);
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update successfully', '');
        }
      });
    } catch (error) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating questions', '');
    }
  };

  return (
    <>
      <div className="edit-quiz__container">
        <div className="title">
          <h2>
            Edit Quiz: <strong>{quiz.name}</strong>
          </h2>
        </div>
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
          <tbody ref={tbodyRef}>
            {data.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>
                    <TextareaAutosize
                      value={val.Question}
                      onChange={(e) => {
                        val.Question = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      value={val.Answer1}
                      onChange={(e) => {
                        val.Answer1 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      value={val.Answer2}
                      onChange={(e) => {
                        val.Answer2 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      value={val.Answer3}
                      onChange={(e) => {
                        val.Answer3 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      value={val.Answer4}
                      onChange={(e) => {
                        val.Answer4 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      value={val.CorrectAnswer}
                      onChange={(e) => {
                        val.CorrectAnswer = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <a id="btn-delete" data-id={val.Id} data-key={key} onClick={() => QuestionDelete(val.Id, key)}>
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
            <button className="btn-add" onClick={() => addQuestion()}>
              Add new Question
            </button>
          </div>
          <div className="f-right">
            <button className="btn-submit" onClick={() => submitChange()}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuiz;

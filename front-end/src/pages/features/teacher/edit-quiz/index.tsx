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
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai';

const EditQuiz: React.FC = () => {
  const quiz = useAppSelector((state) => state.quiz.manageQuizCurQuiz);
  const { id: quizID } = useParams();
  const dispatch = useAppDispatch();
  const [data, setData] = useState([
    { Id: '', Question: '', Answer1: '', Answer2: '', Answer3: '', Answer4: '', CorrectAnswer: '', Edit: '' },
  ]);
  const [quizDetail, setQuizDetail] = useState({ ...quiz });
  const quizName = useRef<any>();

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
    setQuizDetail({ ...quiz });
  }, [quiz]);

  const QuestionDelete = async (e: any, key: any) => {
    if (data.length > 1) {
      try {
        const arr = [...data.slice(0, key), ...data.slice(key + 1)];

        setData(arr);
        const questDocRef = doc(db, DbsName.QUESTION, e);
        await deleteDoc(questDocRef);
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Delete successfully!', '');

        const newData = { ...quizDetail };
        newData.numberOfQuestion = quizDetail.numberOfQuestion - 1;
        console.log(quizDetail.numberOfQuestion);
        await setQuizDetail({ ...newData });
      } catch (error) {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error when delete questions!', '');
      }
    } else {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Cant delete more!', '');
    }
  };

  const addQuestion = () => {
    const newData = [...data];
    const newQuizDetail = quizDetail;
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
    newQuizDetail.numberOfQuestion = newData.length;
    setQuizDetail(newQuizDetail);
  };

  const submitChange = async () => {
    try {
      const quizDocRef = doc(db, DbsName.QUIZ, quiz.id);
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
          // update quiz numberOfQuestion
          await updateDoc(quizDocRef, {
            numberOfQuestion: quizDetail.numberOfQuestion,
          });
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Updated question successfully', '');
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
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Updated question successfully', '');
        }
      });

      // check input valid
      if (quizDetail.timeLimit == 0) {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Time limit is valid`, '');
        return;
      }
      if (quizDetail.name == '' || quizDetail.description == '') {
        openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, `Name or description is valid`, '');
        return;
      }

      //check name exist
      let check = 0;
      const checkQuizName = await getDocs(query(collection(db, DbsName.QUIZ), where('name', '==', quizDetail.name)));
      checkQuizName.forEach((result: any) => {
        if (result.id != '') {
          check += 1;
        }
      });
      if (check != 0) {
        // update quiz detail
        await updateDoc(quizDocRef, {
          timeLimit: quizDetail.timeLimit,
          description: quizDetail.description,
        });
        openCustomNotificationWithIcon(
          NOTIFICATION_TYPE.ERROR,
          "The quiz's name was not updated due to a duplicate !",
          '',
        );
        return;
      }

      // update quiz detail
      await updateDoc(quizDocRef, {
        name: quizDetail.name,
        timeLimit: quizDetail.timeLimit,
        description: quizDetail.description,
      });
      const name = quizName.current;
      name.innerHTML = `${quizDetail.name}`;
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update successfully !', '');
    } catch (error) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating questions !', '');
    }
  };

  return (
    <>
      <div className="edit-quiz__container">
        <div className="title">
          <div className="name-test">
            <h2>
              Edit Quiz: <strong ref={quizName}>{quiz.name}</strong>
              {/* <a className="icon-test" onClick={() => EditQuizDetail()}><AiTwotoneEdit color='#327a81' /></a> */}
            </h2>
          </div>
        </div>
        {quiz && (
          <div className="detail-quiz">
            <div className="element-detail">
              <div className="form-label">Name:</div>
              <input
                type="text"
                className="form-control"
                name="nameQuiz"
                id="nameQuiz"
                defaultValue={quizDetail.name}
                onChange={(e) => {
                  quizDetail.name = e.target.value;
                  setQuizDetail({ ...quizDetail });
                }}
              />
            </div>

            <div className="element-detail">
              <div className="form-label">Time Limit (minute):</div>
              <input
                type="text"
                className="form-control"
                value={quizDetail.timeLimit / 60}
                onChange={(e) => {
                  quizDetail.timeLimit = parseInt(e.target.value) * 60;
                  if (isNaN(quizDetail.timeLimit)) quizDetail.timeLimit = 0;
                  setQuizDetail({ ...quizDetail });
                }}
              />
            </div>

            <div className="element-detail">
              <div className="form-label">Question Count:</div>
              <input
                type="text"
                className="form-control"
                name="numberOfQuestion"
                id="numberOfQuestion"
                value={quizDetail.numberOfQuestion}
              />
            </div>

            <div className="element-detail">
              <div className="form-label">Description:</div>
              <TextareaAutosize
                defaultValue={quizDetail.description}
                onChange={(e) => {
                  quizDetail.description = e.target.value;
                  setQuizDetail({ ...quizDetail });
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { DbsName } from 'src/constants/db';
import { db } from 'src/firebase/firebase';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import './index.scss';
import TextareaAutosize from 'react-textarea-autosize';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { useParams } from 'react-router-dom';
import { handleManageQuiz } from 'src/store/quiz';

const EditQuiz: React.FC = () => {
  const quiz = useAppSelector((state) => state.quiz.manageQuizCurQuiz);
  const { id: quizID } = useParams();
  const dispatch = useAppDispatch();

  const [data, setData] = useState([
    {
      Id: '',
      Question: '',
      Answer1: '',
      Answer2: '',
      Answer3: '',
      Answer4: '',
      CorrectAnswer: '',
      Edit: '',
    },
  ]);

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
    } catch (error) {}
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

  // const addQuestion = () => {
  //   const table = document.getElementsByTagName("tbody");
  //   const tr = '<tr><td>{}</td>' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     '<td><TextareaAutosize/></td >' +
  //     +'</tr >';
  // };

  const submitChange = async () => {
    try {
      data.forEach(async (quest) => {
        if (quest.Edit == '1') {
          const questInfoDocRef = doc(db, DbsName.QUESTION, quest.Id);
          await updateDoc(questInfoDocRef, {
            question: quest.Question,
            ans_1: quest.Answer1,
            ans_2: quest.Answer2,
            ans_3: quest.Answer3,
            ans_4: quest.Answer4,
            correct_ans: quest.CorrectAnswer,
          });
          openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update successfully', '');
        }
      });
    } catch (error) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating questions', '');
    }
  };

  return (
    <>
      <div className="container">
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
              <th colSpan={4}>Answers</th>
              <th rowSpan={2} className="col-Answer">
                Correct Answer
              </th>
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
                      defaultValue={val.Question}
                      onChange={(e) => {
                        val.Question = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      defaultValue={val.Answer1}
                      onChange={(e) => {
                        val.Answer1 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      defaultValue={val.Answer2}
                      onChange={(e) => {
                        val.Answer2 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      defaultValue={val.Answer3}
                      onChange={(e) => {
                        val.Answer3 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      defaultValue={val.Answer4}
                      onChange={(e) => {
                        val.Answer4 = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                  <td>
                    <TextareaAutosize
                      defaultValue={val.CorrectAnswer}
                      onChange={(e) => {
                        val.CorrectAnswer = e.target.value;
                        val.Edit = '1';
                        setData([...data]);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="footer">
          {/* <div className="f-left">
            <button className="btn-add">Add new Question</button>
          </div> */}
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

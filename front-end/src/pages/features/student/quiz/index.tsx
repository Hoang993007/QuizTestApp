/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from '@firebase/firestore';
import { Button } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { cookieName } from 'src/constants/cookieNameVar';
import { DbsName } from 'src/constants/db';
import routePath from 'src/constants/routePath';
import { db } from 'src/firebase/firebase';
import { secondsToTime } from 'src/helpers/indes';
import { IQuizInfo, IQuizQuestion } from 'src/interfaces';
import { handleEndQuiz } from 'src/store/quiz';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import './styles.scss';
import clockIcon from 'src/assets/icons/clock-icon.png';

const getAllQuestions: any = async (quiz: any) =>
  (async (quiz) => {
    try {
      const allQuesDoc: IQuizQuestion[] = [];
      console.log('getDoc');
      const allQuesSnapshot = await getDocs(query(collection(db, DbsName.QUESTION), where('quizID', '==', quiz.id)));

      allQuesSnapshot.forEach((doc: any) => {
        allQuesDoc.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return allQuesDoc;
    } catch (error: any) {
      console.error(error);
    }
  })(quiz);

const Quiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const quiz: IQuizInfo = useAppSelector((state) => state.quiz.quiz);
  const [allQues, setAllQues] = useState<IQuizQuestion[]>([]);
  const [currentQues, setCurrentQuest] = useState(0);
  const [currentAns, setCurrentAns] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenScoreModal, setIsOpenScoreModal] = useState(false);
  const scoreRef = useRef(0);

  // Count down
  const timeLeft = Cookies.get(cookieName.CURRENT_COUNTDOWN)
    ? Number(Cookies.get(cookieName.CURRENT_COUNTDOWN))
    : quiz.timeLimit * 60 * 60;
  const [timeCountDown, setTimeCountDown] = useState({ time: secondsToTime(timeLeft), seconds: timeLeft });

  const resetQuiz = () => {
    setTimeCountDown({ time: secondsToTime(quiz.timeLimit * 60 * 60), seconds: quiz.timeLimit * 60 * 60 });
    scoreRef.current = 0;
    setIsOpenScoreModal(false);
    setCurrentAns([]);
    setCurrentQuest(0);
  };

  const endQuiz = () => {
    Cookies.remove(cookieName.CURRENT_QUIZ);
    dispatch(handleEndQuiz());
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);

    const resultDetails: any[] = [];

    let score = 0;
    allQues.forEach((ques, index) => {
      const quesResultDetails: any = {
        quesID: ques.id,
        correct: Number(ques.correct_ans) === currentAns[index],
      };

      if (Number(ques.correct_ans) === currentAns[index]) {
        score = score + 1;
      } else {
        if (currentAns[index]) quesResultDetails.wrongAns = currentAns[index];
        else quesResultDetails.wrongAns = 0;
      }

      resultDetails.push(quesResultDetails);
    });

    Cookies.remove(cookieName.CURRENT_ANSWER);
    Cookies.remove(cookieName.CURRENT_COUNTDOWN);
    setTimeCountDown({
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      seconds: 0,
    });

    // Save result
    console.log('getDoc');
    const resultSnapshot = await getDocs(
      query(collection(db, DbsName.RESULT), where('quizID', '==', quiz.id), where('userID', '==', user.uid)),
    );

    if (resultSnapshot.empty) {
      await addDoc(collection(db, DbsName.RESULT), {
        userID: user.uid,
        quizID: quiz.id,
        totalScore: allQues.length,
        score,
        date: new Date(),
        resultDetails,
      });
    } else {
      resultSnapshot.forEach(async (docSnap: any) => {
        await updateDoc(doc(db, DbsName.RESULT, docSnap.id), {
          totalScore: allQues.length,
          score,
          date: new Date(),
          resultDetails,
        });
      });
    }

    setIsOpenScoreModal(true);
    scoreRef.current = score;

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (timeCountDown.seconds === 0) {
      if (!isSubmitting && Cookies.get(cookieName.CURRENT_COUNTDOWN)) submitQuiz();
      return;
    } else {
      const countDownInterval = setInterval(() => {
        const secondsLeft = timeCountDown.seconds - 1;
        Cookies.set(cookieName.CURRENT_COUNTDOWN, `${secondsLeft}`);
        setTimeCountDown({
          time: secondsToTime(secondsLeft),
          seconds: secondsLeft,
        });
      }, 1000);

      return () => clearInterval(countDownInterval);
    }
  }, [timeCountDown]);

  useEffect(() => {
    if (Cookies.get(cookieName.CURRENT_ANSWER)) {
      const ans: any = Cookies.get(cookieName.CURRENT_ANSWER)?.split(',');
      if (ans) {
        for (let i = 0; i < ans.length; i++) {
          ans[i] = Number(ans[i]);
        }

        setCurrentAns(ans);
      }
    }
  }, []);

  useEffect(() => {
    if (quiz.id) {
      const getQuesState = async () => {
        const ques = await getAllQuestions(quiz);
        if (ques) setAllQues(ques);
      };

      getQuesState();
    }
  }, [quiz]);

  const setAns = (ans: number) => {
    setCurrentAns((prev) => {
      const newArray = [...prev];
      newArray[currentQues] = ans;
      Cookies.set(cookieName.CURRENT_ANSWER, newArray.toString());
      return newArray;
    });
  };

  return (
    <>
      {user.accessToken && !user.fullname && <Navigate to={routePath.PROFILE} />}
      {(!quiz || !quiz.name || !Cookies.get(cookieName.CURRENT_QUIZ)) && <Navigate to={routePath.TAKE_QUIZ} />}

      {allQues.length > 0 && (
        <>
          <div className="test__current">
            <div className="text">Current question:</div>
            <div className="counter">
              <div className="box">
                {currentQues + 1}/{quiz.numberOfQuestion}
              </div>
            </div>
          </div>
          <div className="test__quest-box">
            QUESTION {currentQues + 1}: {allQues[currentQues].question}
          </div>
          <br></br>
          <div className="test__answer-box">
            <div className="small-box">
              <Button className={currentAns[currentQues] === 1 ? 'user-answer' : ''} onClick={() => setAns(1)}>
                <div className="choice">A.</div>
                {allQues[currentQues].ans_1}
              </Button>
            </div>

            <div className="small-box">
              <Button className={currentAns[currentQues] === 2 ? 'user-answer' : ''} onClick={() => setAns(2)}>
                <div className="choice">B.</div>
                {allQues[currentQues].ans_2}
              </Button>
            </div>

            <div className="small-box">
              <Button className={currentAns[currentQues] === 3 ? 'user-answer' : ''} onClick={() => setAns(3)}>
                <div className="choice">C.</div>
                {allQues[currentQues].ans_3}
              </Button>
            </div>

            <div className="small-box">
              <Button className={currentAns[currentQues] === 4 ? 'user-answer' : ''} onClick={() => setAns(4)}>
                <div className="choice">D.</div>
                {allQues[currentQues].ans_4}
              </Button>
            </div>
          </div>
          <div className="test__navi-butt">
            <div className="butt-box">
              <Button disabled={currentQues === 0 ? true : false} onClick={() => setCurrentQuest((prev) => prev - 1)}>
                Previous
              </Button>
            </div>

            <div className="butt-box submit-btn">
              <Button onClick={submitQuiz}>SUBMIT</Button>
            </div>

            <div
              style={{
                position: 'relative',
              }}
            >
              <img src={clockIcon} alt="clock-icon" />
              <div className="time-text">
                {timeCountDown.time.hours}:{timeCountDown.time.minutes}:{timeCountDown.time.seconds}
              </div>
            </div>

            <div className="butt-box">
              <Button
                disabled={currentQues === allQues.length - 1 ? true : false}
                onClick={() => setCurrentQuest((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {isOpenScoreModal && (
        <div id="myModal" className="modal">
          <div className="modal-content finish-quiz-modal">
            <div className="title">YOUR SCORE</div>
            <div className="score">
              {scoreRef.current}/{allQues.length}
            </div>
            <div className="action">
              <Button className={'redo-btn'} onClick={resetQuiz}>
                REDO
              </Button>
              <Button className={'finist-btn'} onClick={endQuiz}>
                BACK TO QUIZ PAGE
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;

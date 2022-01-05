/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { REQUIRED_FIELD } from 'src/constants/messages';
import './style.scss';
import Papa from 'papaparse';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { IQuizInfo, IQuizQuestion } from 'src/interfaces';
import { useAppSelector } from 'src/store/hooks';

const { TextArea } = Input;
const { Option } = Select;

const CreateQuizStudent: React.FC<{
  visible: boolean;
  setIsOpenCreateNewQuizModal: React.Dispatch<React.SetStateAction<boolean>>;
  getAllQuiz: () => Promise<void>;
}> = ({ visible, setIsOpenCreateNewQuizModal, getAllQuiz }) => {
  const [form] = Form.useForm();
  const [csvfile, setCsvfile] = useState<any>();
  const [csvfileError, setCsvfileError] = useState(false);
  const user = useAppSelector((state) => state.account.user);

  const [timeLimit, setTimeLimit] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleUploadChange = (event: any) => {
    try {
      setCsvfile(event.target.files[0]);
      if (event.target.files[0]) setCsvfileError(false);
    } catch (error: any) {
      setCsvfile(undefined);
    }
  };

  const handleOnCreateQuiz = async (form: any) => {
    const values = await form.validateFields();
    values.quizName = values.quizName.trim();

    console.log('getDoc');
    const quizSameNameSnapshot = await getDocs(
      query(collection(db, DbsName.QUIZ), where('name', '==', values.quizName)),
    );

    if (!quizSameNameSnapshot.empty) {
      openCustomNotificationWithIcon(
        NOTIFICATION_TYPE.ERROR,
        'Quiz name exists',
        'Please choose another name for your quiz',
      );
      return;
    }

    if (!csvfile) {
      setCsvfileError(true);
      return;
    }

    try {
      await Papa.parse(csvfile, {
        complete: async (result: any) => {
          try {
            const quesData: IQuizQuestion[] = result.data.filter(
              (ques: IQuizQuestion) =>
                ques.question && ques.ans_1 && ques.ans_2 && ques.ans_3 && ques.ans_4 && ques.correct_ans,
            );

            const newQuizInfo: IQuizInfo = {
              name: values.quizName,
              numberOfQuestion: quesData.length,
              description: values.description,
              classID: user.fullname,
              timeLimit: timeLimit.hours * 60 * 60 + timeLimit.minutes * 60 + timeLimit.seconds,
              lastModify: new Date(),
            };

            if (quesData.length <= 0) {
              openCustomNotificationWithIcon(
                NOTIFICATION_TYPE.ERROR,
                'No quiz are imported',
                'Your quiz is empty now. Please create at least 1 question for your quiz',
              );
              return;
            }

            const newQuizDocRef = await addDoc(collection(db, DbsName.QUIZ), newQuizInfo);
            const quizID = newQuizDocRef.id;
            quesData.forEach(async (ques: IQuizQuestion) => {
              await addDoc(collection(db, DbsName.QUESTION), {
                ...ques,
                quizID,
              });
            });

            openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Create new quiz successfully', '');
            setIsOpenCreateNewQuizModal(false);
            getAllQuiz();
          } catch (error: any) {
            openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in creating new quiz', '');
            return;
          }
        },
        header: true,
      });
    } catch (error: any) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'File uploaded error', 'Please upload file onece again');
    }
  };

  const renderTimeSelectOptions = (end: number) => {
    const options = [];
    for (let i = 0; i <= end; i++) {
      options.push(i < 10 ? `0${i}` : `${i}`);
    }
    return options;
  };

  const onChangeTimeLimit = (unit: string, value: string) => {
    const newTimeLimit = { ...timeLimit };

    if (unit === 'h') newTimeLimit.hours = Number(value);
    if (unit === 'm') newTimeLimit.minutes = Number(value);
    if (unit === 's') newTimeLimit.seconds = Number(value);

    setTimeLimit(newTimeLimit);
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenCreateNewQuizModal(false)}
      className="create-quiz-form"
      title={<div className={'form__title'}>CREATE NEW QUIZ</div>}
      // closeIcon={hideModal && <img onClick={hideModal} src={CloseIcon} alt="close-icon" />}
      width={'60rem'}
      maskClosable={false}
      // description={description}
      closable={false}
      confirmLoading={true}
      centered={true}
      footer={
        <Form.Item className={'action'}>
          <div className="create-quiz-form__btn">
            <Button className="save-btn" type="primary" htmlType="submit" onClick={() => handleOnCreateQuiz(form)}>
              Create new quiz
            </Button>
            <Button className="cancel-btn" onClick={() => setIsOpenCreateNewQuizModal(false)}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      }
    >
      <Form
        name="create-quiz"
        key="create-quiz"
        initialValues={{
          quizName: '',
          description: '',
          timeLimit: 0,
        }}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item label="Quiz name" name="quizName" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Quiz name" />
        </Form.Item>

        <label
          style={{
            fontSize: '1.9rem',
          }}
        >
          Upload CSV File here
        </label>
        <div className="upload-csv-file">
          <input
            className="csv-input"
            id="import-csv"
            type="file"
            // ref={input => {
            //     console.log(input);
            // }}
            // name="file"
            onChange={handleUploadChange}
          />
          <label htmlFor="import-csv" className="import-csv-label">
            <span className="import-csv__button">
              <UploadOutlined className="import-icon" />
              Click to import CSV file
            </span>
            <span>
              {csvfile ? (
                <>
                  <PaperClipOutlined /> {csvfile.name}
                </>
              ) : (
                'No file are selected'
              )}
            </span>
          </label>
          {csvfileError && <div className="error-text">Please upload csv file</div>}
        </div>

        <Form.Item
          label="Time limit"
          name="timeLimit"
          rules={[
            { required: true, message: REQUIRED_FIELD },
            ({}) => ({
              validator() {
                if (timeLimit.hours * 60 * 60 + timeLimit.minutes * 60 + timeLimit.seconds > 60) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error('Time limit must be greater 1 minutes'));
                }
              },
            }),
          ]}
        >
          <div className="time-limit">
            <div id="timeLimit">
              <Select defaultValue="00" onChange={(value: string) => onChangeTimeLimit('h', value)}>
                {renderTimeSelectOptions(24).map((num) => (
                  <Option key={num} value={Number(num)}>
                    {num}
                  </Option>
                ))}
              </Select>

              <span className="time-tag">hours</span>
              <Select defaultValue="00" onChange={(value: string) => onChangeTimeLimit('m', value)}>
                {renderTimeSelectOptions(60).map((num) => (
                  <Option key={num} value={Number(num)}>
                    {num}
                  </Option>
                ))}
              </Select>

              <span className="time-tag">minutes</span>
              <Select defaultValue="00" onChange={(value: string) => onChangeTimeLimit('s', value)}>
                {renderTimeSelectOptions(60).map((num) => (
                  <Option key={num} value={Number(num)}>
                    {num}
                  </Option>
                ))}
              </Select>
              <span className="time-tag">seconds</span>
            </div>
          </div>
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <TextArea onChange={() => {}} placeholder="Quiz name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateQuizStudent;

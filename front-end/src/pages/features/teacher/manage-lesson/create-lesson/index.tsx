/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Form, Input } from 'antd';
import { REQUIRED_FIELD } from 'src/constants/messages';
import './style.scss';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { addDoc, collection } from '@firebase/firestore';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { ILessonInfo } from 'src/interfaces';
import { useAppSelector } from 'src/store/hooks';
import Modal from 'antd/lib/modal/Modal';

const CreateLesson: React.FC<{
  visible: boolean;
  setIsOpenCreateLesson: React.Dispatch<React.SetStateAction<boolean>>;
  getAllLesson: () => Promise<void>;
}> = ({ visible, setIsOpenCreateLesson, getAllLesson }) => {
  const user = useAppSelector((state) => state.account.user);
  const [form] = Form.useForm();

  const handleOnCreateLesson = async (values: any) => {
    try {
      const newLessonInfo: ILessonInfo = {
        lessonName: values.lessonName,
        content: values.content,
        linkYT: values.linkYT,
        classID: user.classID,
        lastModify: new Date(),
      };

      await addDoc(collection(db, DbsName.LESSON), newLessonInfo);

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Create new lesson successfully', '');
      getAllLesson();
    } catch (error: any) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in creating new lesson', '');
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenCreateLesson(false)}
      className="create-lesson-form"
      title={<div className={'form__title'}>CREATE LESSON</div>}
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
            <Button className="save-btn" type="primary" htmlType="submit" onClick={() => handleOnCreateLesson(form)}>
              Create new quiz
            </Button>
            <Button className="cancel-btn" onClick={() => setIsOpenCreateLesson(false)}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      }
    >
      <Form
        name="create-lesson"
        initialValues={{
          lessonName: '',
          content: '',
          linkYT: '',
        }}
        onFinish={handleOnCreateLesson}
        autoComplete="off"
      >
        <Form.Item label="Lesson name" name="lessonName" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Lesson name" />
        </Form.Item>

        <Form.Item label="Youtube link" name="linkYT" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="URL" />
        </Form.Item>

        <Form.Item label="Content" name="content" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <textarea onChange={() => {}} placeholder="Please write something..."></textarea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLesson;

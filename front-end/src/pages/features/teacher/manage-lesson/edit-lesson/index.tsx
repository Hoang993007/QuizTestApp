/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { REQUIRED_FIELD } from 'src/constants/messages';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { doc, updateDoc } from 'firebase/firestore';

const EditLesson: React.FC<{
  visible: boolean;
  setIsOpenCreateNewQuizModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLesson: any;
  getAllLesson: () => Promise<void>;
}> = ({ visible, setIsOpenCreateNewQuizModal, selectedLesson, getAllLesson }) => {
  const [form] = Form.useForm();

  const handleOnEditLesson = async (form: any) => {
    try {
      const values = await form.validateFields();
      const newLessonInfo = { ...values, lastModify: new Date() };

      const lessonInfoDocRef = await doc(db, DbsName.LESSON, selectedLesson.id);
      await updateDoc(lessonInfoDocRef, newLessonInfo);

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Edit lesson successfully', '');
      setIsOpenCreateNewQuizModal(false);
      getAllLesson();
    } catch (err) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in editing lesson', '');
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenCreateNewQuizModal(false)}
      className="create-quiz-form"
      title={<div className={'form__title'}>EDIT LESSON</div>}
      width={'60rem'}
      maskClosable={false}
      closable={false}
      confirmLoading={true}
      centered={true}
      footer={
        <Form.Item className={'action'}>
          <div className="create-quiz-form__btn">
            <Button className="save-btn" type="primary" htmlType="submit" onClick={() => handleOnEditLesson(form)}>
              Save changes
            </Button>
            <Button className="cancel-btn" onClick={() => setIsOpenCreateNewQuizModal(false)}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      }
    >
      <Form
        name="edit-lesson"
        key="edit-lesson"
        initialValues={{
          lessonName: selectedLesson.lessonName,
          linkYT: selectedLesson.linkYT,
          content: selectedLesson.content,
        }}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item label="Lesson name" name="lessonName" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Lesson name" />
        </Form.Item>

        <Form.Item label="Youtube link" name="linkYT" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Youtube link" />
        </Form.Item>

        <Form.Item label="Content" name="content" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Quiz name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLesson;

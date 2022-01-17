/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import Papa from 'papaparse';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { REQUIRED_FIELD } from 'src/constants/messages';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { doc, updateDoc } from 'firebase/firestore';

const EditCourse: React.FC<{
  visible: boolean;
  setIsOpenCreateNewQuizModal: React.Dispatch<React.SetStateAction<boolean>>;
  lesson: string;
  infoName: string;
  infoCourse: string;
  infoContent: string;
  infoLink: string;
}> = ({ visible, setIsOpenCreateNewQuizModal, lesson, infoName, infoCourse, infoContent, infoLink }) => {
  const [form] = Form.useForm();
  console.log(infoLink);

  const handleOnEditLesson = async (form: any) => {
    try {
      const values = await form.validateFields();

      const newLessonInfo = { ...values };
      console.log('hello');
      const LessonInfoDocRef = await doc(db, DbsName.LESSON, lesson);
      await updateDoc(LessonInfoDocRef, newLessonInfo);
      setIsOpenCreateNewQuizModal(false);
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Edit lesson successfully', '');
    } catch (err) {
      console.log(err);
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating lesson', '');
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenCreateNewQuizModal(false)}
      className="create-quiz-form"
      title={<div className={'form__title'}>EDIT LESSON</div>}
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
          lessonName: infoName,
          linkYT: infoLink,
          content: infoContent,
          courseName: infoCourse,
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

        <Form.Item label="Course name" name="courseName" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Course name" />
        </Form.Item>

        <Form.Item label="Content" name="content" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Quiz name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourse;

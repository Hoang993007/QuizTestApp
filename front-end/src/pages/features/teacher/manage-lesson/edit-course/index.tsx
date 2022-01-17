/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { REQUIRED_FIELD } from 'src/constants/messages';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import { doc, updateDoc } from 'firebase/firestore';

const EditCourse: React.FC<{
  visible: boolean;
  setIsOpenEditCourse: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCourse: any;
  getAllCourse: () => any;
}> = ({ visible, setIsOpenEditCourse, selectedCourse, getAllCourse }) => {
  const [form] = Form.useForm();

  const handleOnEditLesson = async (form: any) => {
    try {
      const values = await form.validateFields();

      const newLessonInfo = { ...values, lastModify: new Date() };
      const LessonInfoDocRef = await doc(db, DbsName.COURSE, selectedCourse.id);
      await updateDoc(LessonInfoDocRef, newLessonInfo);

      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Edit lesson successfully', '');
      setIsOpenEditCourse(false);

      getAllCourse();
    } catch (err) {
      console.log(err);
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating lesson', '');
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenEditCourse(false)}
      className="create-quiz-form"
      title={<div className={'form__title'}>EDIT COURSE</div>}
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
            <Button className="cancel-btn" onClick={() => setIsOpenEditCourse(false)}>
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
          description: selectedCourse.description,
          courseName: selectedCourse.courseName,
        }}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Form.Item label="Course name" name="courseName" rules={[{ required: true, message: REQUIRED_FIELD }]}>
          <Input onChange={() => {}} placeholder="Course name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input onChange={() => {}} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourse;

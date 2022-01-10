import { Button, Form, Modal } from 'antd';
import React from 'react';

const LearnLesson: React.FC<{
  visible: boolean;
  setIsOpenLearnLesson: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setIsOpenLearnLesson }) => {
  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenLearnLesson(false)}
      className=""
      // closeIcon={hideModal && <img onClick={hideModal} src={CloseIcon} alt="close-icon" />}
      width={'60rem'}
      maskClosable={false}
      // description={description}
      closable={false}
      confirmLoading={true}
      centered={true}
      footer={
        <Button className="cancel-btn" onClick={() => setIsOpenLearnLesson(false)}>
          Quit lesson
        </Button>
      }
    >
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/watch?v=mgz1wdlkzcs`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </Modal>
  );
};

export default LearnLesson;

import { Button, Modal } from 'antd';
import React from 'react';
import './styles.scss';

const LearnLesson: React.FC<{
  visible: boolean;
  setIsOpenLearnLesson: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ visible, setIsOpenLearnLesson }) => {
  return (
    <Modal
      visible={visible}
      onCancel={() => setIsOpenLearnLesson(false)}
      className="learn-lesson-modal"
      // closeIcon={hideModal && <img onClick={hideModal} src={CloseIcon} alt="close-icon" />}
      width={'60rem'}
      title={<h2>LESSON: </h2>}
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
      <div className="lesson-video_container">
        <iframe
          className="lesson-video"
          src="https://www.youtube.com/embed/DLX62G4lc44"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default LearnLesson;

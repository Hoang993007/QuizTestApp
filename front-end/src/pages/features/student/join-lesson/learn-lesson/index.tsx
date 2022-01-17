import { Button, Modal, Typography } from 'antd';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import Title from 'antd/lib/skeleton/Title';
import Cookies from 'js-cookie';
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
      title={
        <>
          <h2>{Cookies.get('viewLesson')} </h2>
          <h3
            className="learn-lesson-content"
            style={{
              marginTop: '3rem',
            }}
          >
            Content
          </h3>
          <Typography className="learn-lesson-content">{Cookies.get('content')}</Typography>
        </>
      }
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
          src={Cookies.get('getLink')}
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

import "./styles.scss";
import React from 'react';
import { db } from 'src/firebase/firebase';
import { DbsName } from 'src/constants/db';
import {youtubelink} from 'src/pages/features/student/lesson-video/YoutubeEmbed';

function YoutubeEmbed() {
  return (
     <>
    <div className="App">
      <iframe src={youtubelink} frameBorder="0" width="800px" height="600px" allowFullScreen></iframe>
    </div>
    </>
  );
}
 
export default YoutubeEmbed;
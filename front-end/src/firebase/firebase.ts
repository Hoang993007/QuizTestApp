// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, getDoc, doc, setDoc } from '@firebase/firestore';
import store from 'src/store/store';
import { handleLogin } from 'src/store/auth';
import { IUserInfo } from 'src/interfaces';
import { UserRole } from 'src/constants/constants';
import { DbsName } from 'src/constants/db';
import Cookies from 'js-cookie';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCLInPQvOc55i8cOAfUd6N21NY3KdsCpEY',
  authDomain: 'quizhall-d1667.firebaseapp.com',
  databaseURL: 'https://quizhall-d1667-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'quizhall-d1667',
  storageBucket: 'quizhall-d1667.appspot.com',
  messagingSenderId: '769976307189',
  appId: '1:769976307189:web:1a6406df0bde1cba39a4bc',
};

console.log('### INITIALIZE FIREBASE');
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const usersRef = collection(db, DbsName.USER);
export const classesRef = collection(db, DbsName.CLASS);

onAuthStateChanged(auth, async (userAuth: any) => {
  if (userAuth !== null) {
    console.log('getDoc');
    const userInfoDocSnap = await getDoc(doc(db, DbsName.USER, userAuth.uid));

    /**
     * Nếu là Student mới đăng ký, tạo cho student một profile
     */
    if (!userInfoDocSnap.exists()) {
      const newUserInfo: IUserInfo = {
        fullname: '',
        classID: '',
        role: UserRole.STUDENT,
      };

      await setDoc(doc(db, DbsName.USER, userAuth.uid), newUserInfo);

      store.dispatch(
        handleLogin({
          uid: userAuth.uid,
          email: userAuth.email,
          accessToken: userAuth.accessToken,
          ...newUserInfo,
        }),
      );
    } else {
      store.dispatch(
        handleLogin({
          uid: userAuth.uid,
          email: userAuth.email,
          accessToken: userAuth.accessToken,
          ...userInfoDocSnap.data(),
        }),
      );
    }

    Cookies.set('accessToken', userAuth.accessToken);
    console.log('### LOGED IN !');
  } else {
    Cookies.remove('accessToken');
    console.log('### NO USER');
  }
});

export default app;

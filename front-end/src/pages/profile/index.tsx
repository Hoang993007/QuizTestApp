/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { Button, Form, Input, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useNavigate } from 'react-router-dom';

import { REQUIRED_FIELD } from 'src/constants/messages';
import { classesRef, db } from 'src/firebase/firebase';
import routePath from 'src/constants/routePath';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';

import './styles.scss';
import { UserRole } from 'src/constants/constants';
import { DbsName } from 'src/constants/db';
import { updateUserInfo } from 'src/store/auth';

const { Option } = Select;

const Profile = () => {
  const user = useAppSelector((state) => state.account.user);
  const [provideProfile, setProvideProfile] = useState(false);
  const [classes, setClasses] = useState<{ label: string; value: string }[]>([]);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getClasses = async () => {
      const docSnap = await getDocs(classesRef);
      const classesData: any[] = [];
      docSnap.forEach((doc) => {
        classesData.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      setClasses(classesData);
    };
    getClasses();

    setProvideProfile(user.fullname ? false : true);
    setViewMode(user.fullname ? true : false);
  }, [user]);

  const onSubmit = async (values: any) => {
    try {
      const userInfo = { ...values };

      const userInfoDocRef = await doc(db, DbsName.USER, user.uid);

      await updateDoc(userInfoDocRef, userInfo);
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Update profile successfully', '');
      dispatch(updateUserInfo(userInfo));
      if (provideProfile) navigate(routePath.DASHBOARD);
      else {
        setEditMode(false);
        setViewMode(true);
      }
    } catch (err) {
      openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Error in updating profile', '');
    }
  };

  return (
    <div className={'profile-container'}>
      <div
        className={'profile-form'}
        style={{
          marginTop: '3rem',
        }}
      >
        {(provideProfile || editMode) && (
          <>
            <div className={'form__title'}>
              {provideProfile ? <span>Please provide your info to continue</span> : <span>Hi, {user.fullname}</span>}
            </div>

            <Form
              name="profile"
              initialValues={{
                fullname: user.fullname ? user.fullname : '',
                classID: classes.find((classInfo) => classInfo.value === user.classID)
                  ? classes.find((classInfo) => classInfo.value === user.classID)?.value
                  : '',
              }}
              onFinish={onSubmit}
              autoComplete="off"
            >
              <Form.Item label="Full name" name="fullname" rules={[{ required: true, message: REQUIRED_FIELD }]}>
                <Input onChange={() => {}} placeholder="Full name" />
              </Form.Item>

              <div>
                <span className="profile-form__label">Email</span> {user.email}
              </div>

              {user.role === UserRole.STUDENT && !user.fullname ? (
                <Form.Item label="Class" name="classID" rules={[{ required: true, message: REQUIRED_FIELD }]}>
                  <Select
                    showSearch
                    placeholder="Select your class"
                    optionFilterProp="children"
                    onChange={() => {}}
                    onFocus={() => {}}
                    onBlur={() => {}}
                    onSearch={() => {}}
                    // filterOption={(input, option: any) =>
                    //     option.children.toLowerCPase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {classes.map((classE) => (
                      <Option key={classE.value} value={classE.value}>
                        {classE.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <div>
                  <span className="profile-form__label">Class</span>
                  {classes.find((classInfo) => classInfo.value === user.classID)?.label}
                </div>
              )}

              <Form.Item className={'action'}>
                <div className="profile-form__btn">
                  <Button className={'sign-in-btn'} type="primary" htmlType="submit">
                    SAVE
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}

        {viewMode && (
          <>
            <div className={'form__title'}>
              <span>Hi, {user.fullname}</span>
            </div>

            <div>
              <span className="profile-form__label">Full name</span> {user.fullname}
              {/* <EditOutlined className="profile-form__edit-icon"/> */}
            </div>

            <div>
              <span className="profile-form__label">Email</span> {user.email}
            </div>

            <div>
              <span className="profile-form__label">Class</span>
              {classes.find((classInfo) => classInfo.value === user.classID)?.label}
            </div>

            <div className="profile-form__btn">
              <Button
                className={'profile-form__home-page-btn'}
                type="primary"
                onClick={() => {
                  setViewMode(false);
                  setEditMode(true);
                }}
              >
                EDIT
              </Button>
              <Button
                className={'profile-form__home-page-btn'}
                type="primary"
                onClick={() => navigate(routePath.DASHBOARD)}
              >
                HOME PAGE
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import {
  ContactsOutlined,
  EditOutlined,
  LineChartOutlined,
  ProfileOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import './styles.scss';
import { useAppSelector } from 'src/store/hooks';
import { Navigate, useNavigate } from 'react-router-dom';
import routePath from 'src/constants/routePath';
import { UserRole } from 'src/constants/constants';

const Sidebar = () => {
  const user = useAppSelector((user: any) => user.account.user);
  const navigate = useNavigate();

  return (
    <>
      {user.accessToken && !user.fullname && <Navigate to={routePath.PROFILE} />}

      <Sider className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          // defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          {user.role === UserRole.TEACHER && (
            <>
              <Menu.Item key="manage-quiz" icon={<SnippetsOutlined />} onClick={() => navigate(routePath.MANAGE_TEST)}>
                Manage quiz
              </Menu.Item>

              <Menu.Item
                key="testing-result"
                icon={<ContactsOutlined />}
                onClick={() => navigate(routePath.MANAGE_CLASS)}
              >
                Manage class
              </Menu.Item>

              <Menu.Item
                key="create-lesson"
                icon={<ProfileOutlined />}
                onClick={() => navigate(routePath.CREATE_LESSON)}
              >
                Manage Lesson
              </Menu.Item>

              <Menu.Item key="manage-profile" icon={<ProfileOutlined />} onClick={() => navigate(routePath.PROFILE)}>
                Manage profile
              </Menu.Item>
            </>
          )}

          {user.role === UserRole.STUDENT && (
            <>
              <Menu.Item key="take-quiz" icon={<EditOutlined />} onClick={() => navigate(routePath.TAKE_QUIZ)}>
                Take quizs
              </Menu.Item>

              <Menu.Item
                key="manage-quiz"
                icon={<SnippetsOutlined />}
                onClick={() => navigate(routePath.MANAGE_TEST_STUDENT)}
              >
                My quiz
              </Menu.Item>

              <Menu.Item
                key="testing-result"
                icon={<LineChartOutlined />}
                onClick={() => navigate(routePath.CHART_STUDENT)}
              >
                Testing results
              </Menu.Item>

              <Menu.Item key="manage-profile" icon={<ProfileOutlined />} onClick={() => navigate(routePath.PROFILE)}>
                Manage profile
              </Menu.Item>
            </>
          )}

          {/* <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                </SubMenu> */}
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;

import React from 'react';
import {
  ContactsOutlined,
  ContainerOutlined,
  EditOutlined,
  LineChartOutlined,
  ProfileOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import './styles.scss';
import { useAppSelector } from 'src/store/hooks';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import routePath from 'src/constants/routePath';
import { UserRole } from 'src/constants/constants';

const Sidebar = () => {
  const user = useAppSelector((user: any) => user.account.user);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {user.accessToken && !user.fullname && <Navigate to={routePath.PROFILE} />}

      <Sider className="site-layout-background">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['1']}
          // defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          {user.role === UserRole.TEACHER && (
            <>
              <Menu.Item
                key={routePath.MANAGE_QUIZ}
                icon={<SnippetsOutlined />}
                onClick={() => navigate(routePath.MANAGE_QUIZ)}
              >
                Manage Quizzes
              </Menu.Item>

              <Menu.Item
                key={routePath.MANAGE_CLASS}
                icon={<ContactsOutlined />}
                onClick={() => navigate(routePath.MANAGE_CLASS)}
              >
                Manage Class
              </Menu.Item>

              <Menu.Item
                key={routePath.MANAGE_COURSE}
                icon={<ProfileOutlined />}
                onClick={() => navigate(routePath.MANAGE_COURSE)}
              >
                Manage Courses
              </Menu.Item>

              <Menu.Item key={routePath.PROFILE} icon={<ProfileOutlined />} onClick={() => navigate(routePath.PROFILE)}>
                Manage Profile
              </Menu.Item>
            </>
          )}

          {user.role === UserRole.STUDENT && (
            <>
              <Menu.Item
                key={routePath.CHART_STUDENT}
                icon={<LineChartOutlined />}
                onClick={() => navigate(routePath.CHART_STUDENT)}
              >
                Quiz results
              </Menu.Item>

              <Menu.Item
                key={routePath.TAKE_QUIZ}
                icon={<EditOutlined />}
                onClick={() => navigate(routePath.TAKE_QUIZ)}
              >
                Take quizs
              </Menu.Item>

              <Menu.Item
                key={routePath.MY_QUIZ}
                icon={<SnippetsOutlined />}
                onClick={() => navigate(routePath.MY_QUIZ)}
              >
                My quiz
              </Menu.Item>

              <Menu.Item key={routePath.PROFILE} icon={<ProfileOutlined />} onClick={() => navigate(routePath.PROFILE)}>
                Manage profile
              </Menu.Item>

              <Menu.Item
                key={routePath.JOIN_COURSE}
                icon={<ContainerOutlined />}
                onClick={() => navigate(routePath.JOIN_COURSE)}
              >
                Join course
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;

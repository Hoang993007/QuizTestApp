import React from 'react';
import { Navigate } from 'react-router-dom';
import routePath from 'src/constants/routePath';
import { useAppSelector } from 'src/store/hooks';

import './styles.scss';

const Dashboard: React.FC = () => {
  const user = useAppSelector((user) => user.account.user);

  return (
    <>
      {user.accessToken && !user.fullname && <Navigate to={routePath.PROFILE} />}

      {user.accessToken && user.role === 0 && <Navigate to={routePath.CHART_STUDENT} />}
      {user.accessToken && user.role === 1 && <Navigate to={routePath.MANAGE_TEST} />}
    </>
  );
};

export default Dashboard;

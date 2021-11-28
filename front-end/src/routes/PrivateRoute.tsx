import React from 'react';
import { Navigate } from 'react-router-dom';
import routePath from 'src/constants/routePath';
import { useAppSelector } from 'src/store/hooks';

const PrivateRoute: React.FC<any> = ({
  Component,
  // roleAllow,
}) => {
  const user = useAppSelector((state) => state.account.user);

  return (
    <>
      {user.accessToken ? (
        // && roleAllow.includes(Number(role))
        <Component />
      ) : (
        <Navigate to={routePath.SIGN_IN} />
      )}
    </>
  );
};

export default PrivateRoute;

import { Outlet, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';

import SideMenu from '@/components/organisms/SideMenu';

import { authUserAtom } from '@/store/user';

const AuthProvider = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const auth = getAuth();
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged');
    if (user) {
      setAuthUser(user);
    } else {
      setAuthUser(null);
      navigate('/accounts/login');
    }
  });
  return (
    <>
      <div className="sp">
        <Outlet />
      </div>
      <div className="pc flex">
        <SideMenu />
        <Outlet />
      </div>
    </>
  );
};

export default AuthProvider;

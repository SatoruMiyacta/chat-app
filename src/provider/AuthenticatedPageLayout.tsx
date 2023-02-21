import { Outlet, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';

import SideMenu from '@/components/organisms/SideMenu';
import CreateGroup from '@/components/pages/group/createGroup';

import { authUserAtom } from '@/store/user';

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
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
      <div className="sp">{children}</div>
      <div className="pc flex">
        <SideMenu />
        {children}
      </div>
    </>
  );
};

export default AuthProvider;

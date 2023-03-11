import { useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useSetAtom } from 'jotai';

import SideMenu from '@/components/organisms/SideMenu';

import { authUserAtom } from '@/store/user';

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setAuthUser = useSetAtom(authUserAtom);
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
  const isPcWindow = window.matchMedia('(min-width:1024px)').matches;
  return (
    <div>
      {!isPcWindow && <div>{children}</div>}
      {isPcWindow && (
        <div className="flex">
          <SideMenu />
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export default AuthProvider;

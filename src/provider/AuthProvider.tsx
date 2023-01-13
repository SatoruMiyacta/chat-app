import { Outlet, useNavigate } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';

import { authUserAtom } from '@/store/user';

const AuthProvider = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const auth = getAuth();
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged');
    // console.log(userData);
    if (user) {
      const uid = user.uid;
      setAuthUser(user);
    } else {
      setAuthUser(null);
      navigate('/accounts/login');
    }
  });
  return <Outlet />;
};

export default AuthProvider;

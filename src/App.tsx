import { Route, Routes } from 'react-router-dom';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fab } from '@fortawesome/free-brands-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { fas } from '@fortawesome/free-solid-svg-icons';

import Contact from '@/components/pages/accounts/contact';
import CreateAcconunts from '@/components/pages/accounts/create';
import Login from '@/components/pages/accounts/login';
import ResetPassword from '@/components/pages/accounts/resetPassword';
import CreateMember from '@/components/pages/group/createMember';
import CreateName from '@/components/pages/group/createName';
import Edit from '@/components/pages/group/editGroup';
import Home from '@/components/pages/home/index';
import NotFound from '@/components/pages/not-found';
import DeleteAccount from '@/components/pages/profile/deleteAccount';
import EditProfile from '@/components/pages/profile/editProfile';
import Profile from '@/components/pages/profile/index';
import ProfileLayout from '@/components/pages/profile/profileLayout';
import Rooms from '@/components/pages/rooms/index';
import Message from '@/components/pages/rooms/message';

import AuthProvider from '@/provider/AuthProvider';
import './App.css';

// library.add(fas, far, fab);

// Appでロジックをかくと、hoge等適当なpathのときに404が出せなかった。

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/accounts">
          <Route index element={<NotFound />} />
          <Route path="login" element={<Login />} />
          <Route path="create" element={<CreateAcconunts />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ここ見ただけでログインが必要なpageがわかる */}
        <Route path="/" element={<AuthProvider />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />}>
            <Route index element={<NotFound />} />
            <Route path="message" element={<Message />} />
          </Route>
          {/* notfoundじゃない共通するコンポーネント */}
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="delete-account" element={<DeleteAccount />} />
          </Route>
          <Route path="group" element={<NotFound />}>
            <Route index element={<NotFound />} />
            <Route path="create" element={<CreateMember />} />
            <Route path="create" element={<CreateName />} />
            <Route path="edit" element={<Edit />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;

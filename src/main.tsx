import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Contact from '@/components/pages/accounts/contact';
import CreateAcconunts from '@/components/pages/accounts/create';
import Login from '@/components/pages/accounts/login';
import ResetPassword from '@/components/pages/accounts/resetPassword';
import CreateGroup from '@/components/pages/group/createGroup';
import EditGroup from '@/components/pages/group/editGroup';
import GroupLayout from '@/components/pages/group/groupLayout';
import GroupProfile from '@/components/pages/group/profile';
import Block from '@/components/pages/home/block';
import HomeLayout from '@/components/pages/home/homeLayout';
import Home from '@/components/pages/home/index';
import Search from '@/components/pages/home/search';
import NotFound from '@/components/pages/not-found';
import DeleteAccount from '@/components/pages/profile/deleteAccount';
import EditProfile from '@/components/pages/profile/editProfile';
import Profile from '@/components/pages/profile/index';
import ProfileLayout from '@/components/pages/profile/profileLayout';
import Rooms from '@/components/pages/rooms/index';
import Message from '@/components/pages/rooms/message';
import RoomLayout from '@/components/pages/rooms/roomLayout';
import Users from '@/components/pages/users';

import AuthProvider from '@/provider/AuthenticatedPageLayout';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

library.add(fas, far, fab);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = getAuth(app);

const router = createBrowserRouter([
  {
    path: 'accounts',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'create',
        element: <CreateAcconunts />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <HomeLayout>
          <Home />
        </HomeLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/search',
    element: (
      <AuthProvider>
        <Search />
      </AuthProvider>
    ),
  },
  {
    path: '/block',
    element: (
      <AuthProvider>
        <Block />
      </AuthProvider>
    ),
  },
  {
    path: 'users/:postId',
    element: (
      <AuthProvider>
        <Users />
      </AuthProvider>
    ),
  },

  {
    path: 'rooms',
    element: (
      <AuthProvider>
        <RoomLayout>
          <Rooms />
        </RoomLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'rooms/:postId/message',
    element: (
      <AuthProvider>
        <RoomLayout>
          <Message />
        </RoomLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'profile',
    element: (
      <AuthProvider>
        <ProfileLayout>
          <Profile />
        </ProfileLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'profile/edit',
    element: (
      <AuthProvider>
        <ProfileLayout>
          <EditProfile />
        </ProfileLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'profile/delete-account',
    element: (
      <AuthProvider>
        <ProfileLayout>
          <DeleteAccount />
        </ProfileLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'group/create',
    element: (
      <AuthProvider>
        <GroupLayout>
          <CreateGroup />
        </GroupLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'group/:postId/edit',
    element: (
      <AuthProvider>
        <HomeLayout>
          <EditGroup />
        </HomeLayout>
      </AuthProvider>
    ),
  },
  {
    path: 'group/:postId/profile',
    element: (
      <AuthProvider>
        <HomeLayout>
          <GroupProfile />
        </HomeLayout>
      </AuthProvider>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

if (import.meta.env.MODE !== 'test') {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

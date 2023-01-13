import { useState } from 'react';

export const useContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactText, setContactText] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [contactTextErrorMessage, setContactTextErrorMessage] = useState('');

  const isComplete = () => {
    if (!name) return false;
    if (!email) return false;
    if (!contactText) return false;

    // const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!nameRegex.test(name)) return false;

    // const contactTextRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!contactTextRegex.test(contactText)) return false;

    return true;
  };

  const nameComplete = () => {
    // const nameRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!nameRegex.test(name)) {
    //   return '半角英数字か全角で入力してください';
    // }
    // return '';
  };

  const contactTextComplete = () => {
    // const contactTextRegex = new RegExp('[^\x01-/:-@[-`{-~]+');
    // if (!contactTextRegex.test(contactText)) {
    //   return '半角英数字か全角で入力してください';
    // }
    // return '';
  };

  return {
    name,
    setName,
    email,
    setEmail,
    contactText,
    setContactText,
    nameErrorMessage,
    setNameErrorMessage,
    contactTextErrorMessage,
    setContactTextErrorMessage,
    nameComplete,
    isComplete,
    contactTextComplete,
  };
};

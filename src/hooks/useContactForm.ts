// import { useState } from 'react';

export const useContactForm = () => {
  // const [text, setText] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  // const isComplete = () => {
  //   if (!text) return false;
  //   if (!email) return false;
  //   if (!password) return false;
  //   const emailRegex = new RegExp(
  //     '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$'
  //   );
  //   const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
  //   if (!emailRegex.test(email)) return false;
  //   if (!passWordRegex.test(password)) {
  //     return false;
  //   }
  //   return true;
  // }
  // const passwordComplete = () => {
  //   const passWordRegex = new RegExp('^[0-9a-zA-Z]*$');
  //   if (!passWordRegex.test(password)) {
  //     return '半角英数字で入力してください';
  //   }
  //   return '';
  // }
  // const handleChangeText = (
  //   event:
  //     | React.ChangeEvent<HTMLInputElement>
  //     | React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //     setText(event.target.value);
  // };
  // const handleChangeEmail = (
  //   event:
  //     | React.ChangeEvent<HTMLInputElement>
  //     | React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   setEmail(event.target.value);
  // };
  // const handleChangePassword = (
  //   event:
  //     | React.ChangeEvent<HTMLInputElement>
  //     | React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //     setPassword(event.target.value);
  // };
  // const handleBlur = (
  //   event:
  //     | React.FocusEvent<HTMLInputElement, Element>
  //     | React.FocusEvent<HTMLTextAreaElement, Element>
  // ) => {
  //   const errorMessage = passwordComplete();
  //   setPasswordErrorMessage(errorMessage);
  // };
  // const handleClick = () => {
  //   if (!isComplete()) {
  //     return;
  //   }
  // };
  // return {text,email, password,passwordErrorMessage,handleChangeText,handleChangeEmail,handleChangePassword,handleClick,handleBlur,isComplete}
};

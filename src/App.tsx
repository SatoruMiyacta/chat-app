// import { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import Input from './components/atoms/Input';
// import Button from './components/atoms/Button';
// import Checkbox from './components/atoms/Checkbox';

// import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { faIdCard } from '@fortawesome/free-solid-svg-icons';
// import { faLock } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
// import { useContactForm } from './hooks/index';

library.add(fas, far, fab);

const App = () => {
  // const {
  //   text,
  //   email,
  //   password,
  //   passwordErrorMessage,
  //   handleChangeText,
  //   handleChangeEmail,
  //   handleChangePassword,
  //   handleClick,
  //   handleBlur,
  //   isComplete,
  // } = useContactForm();
  // return (
  //   <>
  // <div className="App">
  //   <div>
  //     <Input
  //       type="text"
  //       color="primary"
  //       variant="outlined"
  //       placeholder="ユーザーネーム"
  //       label="ユーザーネーム"
  //       startIcon={<FontAwesomeIcon icon={faIdCard} />}
  //       id="outlined"
  //       value={text}
  //       isRequired
  //       isMultiLines
  //       // isRounded
  //       onChange={handleChangeText}
  //       onBlur={handleBlur}
  //       // rows={4}
  //       // maxRows={5}
  //       // minRows={3}
  //     />
  //         <Input
  //           type="email"
  //           color="primary"
  //           variant="outlined"
  //           label="メールアドレス"
  //           startIcon={<FontAwesomeIcon icon={faEnvelope} />}
  //           id="email"
  //           value={email}
  //           isRequired
  //           onChange={handleChangeEmail}
  //           onBlur={handleBlur}
  //         />
  //         <Input
  //           type="password"
  //           color="primary"
  //           variant="outlined"
  //           placeholder="パスワード"
  //           startIcon={<FontAwesomeIcon icon={faLock} />}
  //           id="password"
  //           value={password}
  //           errorMessage={passwordErrorMessage}
  //           isRequired
  //           onChange={handleChangePassword}
  //           onBlur={handleBlur}
  //         />
  //         <Button
  //           color="primary"
  //           variant="contained"
  //           isDisabled={!isComplete()}
  //           onClick={handleClick}
  //         >
  //           ボタン
  //         </Button>
  //       </div>
  //     </div>
  //   </>
  // );
  // const [isChecked, setIsChecked] = useState(false);
  // const [items, setItems] = useState([
  //   { id: 'first', label: 'checkbox', isChecked: false, isDisabled: false },
  //   { id: 'second', label: 'checkbox2', isChecked: false, isDisabled: false },
  //   { id: 'third', label: 'checkbox3', isChecked: false, isDisabled: false },
  // ]);
  // const handleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index?: number
  // ) => {
  //   // setIsChecked(!isChecked);
  //   // console.log(event.target.id);
  //   // items.forEach((item, index) => {
  //   //   if (item.id === event.target.id) console.log(index);
  //   // });
  //   //   const index = items.findIndex((item) => item.id === event.target.id);
  //   if (index !== undefined) {
  //     const newItems = [...items];
  //     newItems[index].isChecked = !newItems[index].isChecked;
  //     // console.log(newItems[index].isChecked);
  //     setItems(newItems);
  //   }
  //   // setItems(items.map((obj,index) => {
  //   //   if (!obj.isChecked) {
  //   //     return { ...obj, isChecked: true };
  //   //   }
  //   //   return { ...obj, isChecked: false };
  //   // });
  //   // );
  // };
  // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsChecked(!isChecked);
  // };
  return (
    <></>
    //   <>
    //     <Checkbox
    //       color="primary"
    //       vertical
    //       items={items}
    //       onChange={(event, index) => handleChange(event, index)}
    //     />
    //     <Checkbox
    //       color="primary"
    //       id="first"
    //       label="checkbox"
    //       // isChecked
    //       isChecked={isChecked}
    //       // isDisabled
    //       // vertical
    //       // items={items}
    //       onChange={onChange}
    //     />
    //     <Input
    //       type="text"
    //       color="primary"
    //       variant="outlined"
    //       placeholder="ユーザーネーム"
    //       label="ユーザーネーム"
    //       startIcon={<FontAwesomeIcon icon={faIdCard} />}
    //       id="outlined"
    //       value={text}
    //       // isRequired
    //       // isMultiLines
    //       // isRounded
    //       onChange={handleChangeText}
    //       onBlur={handleBlur}
    //       // rows={4}
    //       maxRows={5}
    //       // minRows={3}
    //     />
    //   </>
  );
};

export default App;

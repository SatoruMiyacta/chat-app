import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { useState } from 'react';
// import Tabs, { TabsItem, TabsProps } from './components/atoms/Tabs';
// import Heading, { HeadingProps } from './components/atoms/Heading';
// import Input, { InputProps } from './components/atoms/Input';
// import Button, { ButtonProps } from './components/atoms/Button';
// import Menu, { item, MenuProps } from './components/molecules/Menu';
// import Checkbox, { CheckboxProps } from './components/atoms/Checkbox';
// import Fab, { FabProps } from './components/atoms/FloatingActionButton';

// import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { faIdCard } from '@fortawesome/free-solid-svg-icons';
// import { faLock } from '@fortawesome/free-solid-svg-icons';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
// import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import { faUsers } from '@fortawesome/free-solid-svg-icons';
// import { faCommentMedical } from '@fortawesome/free-solid-svg-icons';
// import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
// import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
// import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
// import Modal, { ModalProps } from './components/molecules/Modal';
// import './App.css';
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

  {
    /**
-----------------------------------------------------------------------------------
*/
  }

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
  // return (
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
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }

  // const [activeIndex, setActiveIndex] = useState(0);

  // const [items, setItems] = useState<TabsItem[]>([
  //   {
  //     label: 'tabs',
  //     icon: <FontAwesomeIcon icon={faUser} />,
  //     isDisabled: false,
  //   },
  //   {
  //     label: 'tabs',
  //     icon: <FontAwesomeIcon icon={faUser} />,
  //     isDisabled: false,
  //   },
  //   {
  //     label: 'tabs',
  //     icon: <FontAwesomeIcon icon={faUser} />,
  //     isDisabled: false,
  //   },
  //   {
  //     label: 'tabs',
  //     icon: <FontAwesomeIcon icon={faUser} />,
  //     isDisabled: false,
  //   },
  //   {
  //     label: 'tabs',
  //     icon: <FontAwesomeIcon icon={faUser} />,
  //     isDisabled: true,
  //   },
  // ]);
  // const handleClick = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   index: number
  // ) => {
  //   if (items[index] !== items[activeIndex]) setActiveIndex(index);
  // };

  // return (
  //   <>
  //     <div>
  //       <Tabs
  //         color="primary"
  //         items={items}
  //         activeIndex={activeIndex}
  //         isBorder
  //         onClick={(event, index) => handleClick(event, index)}
  //       />
  //     </div>
  //   </>
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }
  // const [show, setShow] = useState(false);

  // const handleOpen = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   setShow(true);
  //   // setShow(!show);
  // };

  // const handleClose = () => {
  //   setShow(false);
  // };
  // return (
  //   <>
  //     <Modal
  //       isOpen={show}
  //       onClick={handleClose}
  //       showCloseButton
  //       title="heading"
  //       titleAlign="center"
  //       hasInner
  //     >
  //       <div className="modal">
  //         {/* <div className="top">
  //           <FontAwesomeIcon icon={faCircleUser} size="3x" />
  //         </div>
  //         <div className="btn">
  //           <div className="leftBtn">
  //             <Button color="gray" variant="text" onClick={() => {}}>
  //               <FontAwesomeIcon icon={faUserPlus} size="3x" />
  //             </Button>
  //           </div>
  //           <div className="rightBtn">
  //             <Button color="gray" variant="text" onClick={() => {}}>
  //               <FontAwesomeIcon icon={faCommentMedical} size="3x" />
  //             </Button>
  //           </div>
  //         </div> */}
  //         <p>
  //           The content of modal is unmounted when closed. If you need to make
  //           the content available to search engines or render expensive
  //           component trees inside your modal while optimizing for interaction
  //           responsiveness it might be a good idea to change this default
  //           behavior by enabling the keepMounted prop:
  //         </p>
  //       </div>
  //     </Modal>
  //     <Button
  //       color="gray"
  //       variant="text"
  //       onClick={(event) => handleOpen(event)}
  //     >
  //       ボタン
  //     </Button>
  //   </>
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }

  // const [items, isItems] = useState([
  //   {
  //     label: (
  //       <>
  //         <FontAwesomeIcon
  //           icon={faPenToSquare}
  //           style={{ marginRight: '8px', opacity: 0.5 }}
  //         />
  //         編集
  //       </>
  //     ),
  //     onClick: () => {},
  //   },
  //   {
  //     label: (
  //       <>
  //         <FontAwesomeIcon
  //           icon={faTrash}
  //           style={{ width: '16px', marginRight: '8px', opacity: 0.5 }}
  //         />
  //         削除
  //       </>
  //     ),
  //     onClick: () => {},
  //   },
  //   {
  //     label: (
  //       <>
  //         <FontAwesomeIcon
  //           icon={faFloppyDisk}
  //           style={{ width: '16px', marginRight: '8px', opacity: 0.5 }}
  //         />
  //         保存
  //       </>
  //     ),
  //     onClick: () => {},
  //   },
  //   {
  //     label: (
  //       <>
  //         <FontAwesomeIcon
  //           icon={faFloppyDisk}
  //           style={{ width: '16px', marginRight: '8px', opacity: 0.5 }}
  //         />
  //         ブックマーク
  //       </>
  //     ),
  //     onClick: () => {},
  //   },
  // ]);

  // return (
  //   <>
  //     <div className="menu">
  //       <Menu
  //         items={items}
  //         buttonChildren={<FontAwesomeIcon icon={faEllipsisVertical} />}
  //       ></Menu>
  //     </div>
  //   </>
  // );
  return <></>;
};

export default App;

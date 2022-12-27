// import { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';

// import { useContactForm } from './hooks/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
// import {
//   faEnvelope,
//   faIdCard,
//   faLock,
//   faUser,
//   faXmark,
//   faUsers,
//   faCommentMedical,
//   faMessage,
//   faCircleUser,
//   faEllipsisVertical,
//   faPenToSquare,
//   faTrash,
//   faFloppyDisk,
//   faUserPlus,
//   faChevronLeft,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import Button, { ButtonProps } from '@/components/atoms/Button';
// import Checkbox, {
//   checkoboxItem,
//   CheckboxProps,
// } from '@/components/atoms/Checkbox';
// import Fab, { FabProps } from '@/components/atoms/FloatingActionButton';
// import Heading, { HeadingProps } from '@/components/atoms/Heading';
// import Input, { InputProps } from '@/components/atoms/Input';
// import Tabs, { TabsItem, TabsProps } from '@/components/atoms/Tabs';
// import Menu, { MenuItem, MenuProps } from '@/components/molecules/Menu';
// import Modal, { ModalProps } from '@/components/molecules/Modal';
// import BottomNavigation from '@/components/organisms/BottomNavigation';
// import Header, { ActionItem, HeaderProps } from '@/components/organisms/Header';
// import Home from '@/components/pages/home/Index';
// import Profile from '@/components/pages/profile/Index';
// import Rooms from '@/components/pages/rooms/Index';

// import './App.css';

library.add(fas, far, fab);

const App = () => {
  // return (
  //   <Routes>
  //     <Route path="/accounts" element={}>
  //       <Route path="/login" element={}></Route>
  //       <Route path="/create" element={}></Route>
  //       <Route path="/reset-password" element={}></Route>
  //     </Route>
  //     <Route path="/profile" element={}>
  //       <Route path="/edit" element={}></Route>
  //       <Route path="/delete-account" element={}></Route>
  //     </Route>
  //     <Route path="/users" element={}>
  //       <Route path="/{userId}" element={}></Route>
  //     </Route>
  //     <Route path="/home" element={}></Route>
  //     <Route path="/groups" element={}>
  //       <Route path="/create" element={}></Route>
  //       <Route path="/{groupId}" element={}>
  //         <Route path="/edit" element={}></Route>
  //       </Route>
  //     </Route>
  //     <Route path="/rooms" element={}>
  //       <Route path="/{roomId}" element={}></Route>
  //       <Route path="/message" element={}></Route>
  //     </Route>
  //   </Routes>
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }
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

  // const [items, isItems] = useState<MenuItem[]>([
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

  {
    /**
-----------------------------------------------------------------------------------
*/
  }
  // const [menuItems, setMenuItems] = useState<MenuItem[]>([
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
  // ]);

  // const [actionItems, setActionItems] = useState<ActionItem[]>([
  //   {
  //     item: <FontAwesomeIcon icon={faUser} />,
  //     // item: '保存',
  //     onClick: () => {},
  //   },
  //   {
  //     item: '編集',
  //     onClick: () => {},
  //   },
  //   {
  //     item: '保存',
  //     onClick: () => {},
  //   },
  // ]);

  // return (
  //   <>
  //     <Header
  //       // showBackButton
  //       // title="プロフィール"
  //       title="パスワードリセット"
  //       actionItems={actionItems}
  //       // menu={menuItems}
  //     />
  //     <BottomNavigation />
  //   </>
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }

  // 思い込みに気をつけて、今までの形にとらわれない、なんでpropsを使うか理由も考えて
  // 一から考えて、どうしたいか考えてください！

  // return (
  //   <>
  //     <BottomNavigation />
  //   </>
  // );

  {
    /**
-----------------------------------------------------------------------------------
*/
  }

  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes> */}
    </>
  );
};

export default App;

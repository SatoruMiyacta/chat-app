import {
  faEllipsisVertical,
  faBan,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Menu from '@/components/molecules/Menu';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Molecules/Menu',
  component: Menu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    buttonColor: {
      options: ['primary', 'inherit', 'white', 'danger'],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Menu>;

const menuItems = [
  {
    label: (
      <>
        <FontAwesomeIcon
          icon={faBan}
          style={{ marginRight: '8px', opacity: 0.5 }}
        />
        ブロック
      </>
    ),
    onClick: () => {
      ('');
    },
  },
  {
    label: (
      <>
        <FontAwesomeIcon
          icon={faTrash}
          style={{ width: '16px', marginRight: '8px', opacity: 0.5 }}
        />
        削除
      </>
    ),
    onClick: () => {
      ('');
    },
  },
];

const Template: ComponentStory<typeof Menu> = (args) => (
  <>
    <h2>menuPosition</h2>

    <p>
      メニュー表示位置はデフォルトでボタン要素の左下に表示されます。
      <br />
      左下に余白がないときは、メニュー要素の高さと横幅の分余白が空いているところに表示されます
    </p>
    <ul className="menu">
      <li>
        <Menu {...args} />
      </li>
      <li>
        <Menu {...args} />
      </li>
      <li>
        <Menu {...args} />
      </li>
      <li>
        <Menu {...args} />
      </li>
    </ul>
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  items: menuItems,
  buttonColor: 'inherit',
  buttonChildren: <FontAwesomeIcon icon={faEllipsisVertical} />,
};

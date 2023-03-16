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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Menu> = (args) => (
  <>
    <p>menuPosition</p>
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

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  items: menuItems,
  buttonColor: 'primary',
  buttonChildren: <FontAwesomeIcon icon={faEllipsisVertical} />,
};
export const Inherit = Template.bind({});
Inherit.args = {
  items: menuItems,
  buttonColor: 'inherit',
  buttonChildren: <FontAwesomeIcon icon={faEllipsisVertical} />,
};

export const White = Template.bind({});
White.args = {
  items: menuItems,
  buttonColor: 'white',
  buttonChildren: <FontAwesomeIcon icon={faEllipsisVertical} />,
};
White.decorators = [
  (Story) => (
    <body style={{ background: '#333', color: '#fff', width: '200px' }}>
      <Story />
    </body>
  ),
];
export const Danger = Template.bind({});
Danger.args = {
  items: menuItems,
  buttonColor: 'danger',
  buttonChildren: <FontAwesomeIcon icon={faEllipsisVertical} />,
};

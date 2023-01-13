import {
  faEllipsisVertical,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      options: ['primary', 'gray', 'white', 'danger'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['contained', 'outlined', 'text'],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <>
    <p>variants</p>
    <ul>
      <li>
        <Button {...args} variant="contained" />
      </li>
      <li>
        <Button {...args} variant="outlined" />
      </li>
      <li>
        <Button {...args} variant="text" />
      </li>
    </ul>
    <ul>
      <li>
        <Button {...args} variant="contained" isDisabled />
      </li>
      <li>
        <Button {...args} variant="outlined" isDisabled />
      </li>
      <li>
        <Button {...args} variant="text" isDisabled />
      </li>
    </ul>
    <p>wide</p>
    <ul>
      <li className="wide">
        <Button {...args} variant="contained" isFullWidth />
      </li>
      <li className="wide">
        <Button {...args} variant="contained" isDisabled isFullWidth />
      </li>
    </ul>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
  children: 'ボタン',
};
export const Inherit = Template.bind({});
Inherit.args = {
  color: 'inherit',
  children: 'ボタン',
};
export const InheritIconText = Template.bind({});
InheritIconText.args = {
  color: 'inherit',
  children: <FontAwesomeIcon icon={faEllipsisVertical} />,
};
export const WhiteText = Template.bind({});
WhiteText.args = {
  color: 'white',
  children: <FontAwesomeIcon icon={faChevronLeft} />,
};
WhiteText.decorators = [
  (Story) => (
    <body style={{ background: '#333', color: '#fff' }}>
      <Story />
    </body>
  ),
];

export const DangerOutlinedFullWidth = Template.bind({});
DangerOutlinedFullWidth.args = {
  color: 'danger',
  children: 'アカウント削除',
};

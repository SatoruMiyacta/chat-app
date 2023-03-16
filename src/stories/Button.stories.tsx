import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@/components/atoms/Button';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Atoms/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      options: ['primary', 'inherit', 'white', 'danger'],
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
        <Button {...args} variant="contained" isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="outlined" isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="text" isRounded={false} />
      </li>
    </ul>
    <ul>
      <li>
        <Button {...args} variant="contained" isDisabled isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="outlined" isDisabled isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="text" isDisabled isRounded={false} />
      </li>
    </ul>
    <p>sizes</p>
    <ul>
      <li>
        <Button {...args} variant="contained" size="small" isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="contained" size="medium" isRounded={false} />
      </li>
      <li>
        <Button {...args} variant="contained" size="large" isRounded={false} />
      </li>
    </ul>
    <p>rounded</p>
    <ul>
      <li>
        <Button {...args} variant="contained" size="small" />
      </li>
      <li>
        <Button {...args} variant="contained" size="medium" />
      </li>
      <li>
        <Button {...args} variant="contained" size="large" />
      </li>
    </ul>
    <p>wide</p>
    <ul>
      <li className="wide">
        <Button {...args} variant="contained" isFullWidth isRounded={false} />
      </li>
      <li className="wide">
        <Button
          {...args}
          variant="contained"
          isDisabled
          isFullWidth
          isRounded={false}
        />
      </li>
    </ul>
  </>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
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

export const White = Template.bind({});
White.args = {
  color: 'white',
  children: 'ボタン',
};
White.decorators = [
  (Story) => (
    <body style={{ background: '#333', color: '#fff' }}>
      <Story />
    </body>
  ),
];

export const Danger = Template.bind({});
Danger.args = {
  color: 'danger',
  children: 'ボタン',
};

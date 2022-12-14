import { ComponentStory, ComponentMeta } from '@storybook/react';
import Checkbox from '../components/atoms/Checkbox';

export default {
  title: 'components/Checkbox',
  component: Checkbox,
  argTypes: {
    color: {
      options: ['primary', 'gray', 'white', 'danger'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <>
    <p>without label</p>
    <ul>
      <li>
        <Checkbox {...args} id="default" />
      </li>
      <li>
        <Checkbox {...args} id="default" isDisabled />
      </li>
      <li>
        <Checkbox {...args} id="default" isChecked />
      </li>
      <li>
        <Checkbox {...args} id="disabledChecked" isDisabled isChecked />
      </li>
    </ul>
    <p>size</p>
    <ul>
      <li>
        <Checkbox {...args} id="default" size="small" />
      </li>
      <li>
        <Checkbox {...args} id="default" isDisabled size="small" />
      </li>
      <li>
        <Checkbox {...args} id="default" isChecked size="small" />
      </li>
      <li>
        <Checkbox
          {...args}
          id="disabledChecked"
          isDisabled
          isChecked
          size="small"
        />
      </li>
    </ul>
    <p>label</p>
    <ul>
      <li>
        <Checkbox {...args} id="default" label="checkbox" />
      </li>
      <li>
        <Checkbox {...args} id="default" label="checkbox" isDisabled />
      </li>
      <li>
        <Checkbox {...args} id="default" label="checkbox" isChecked />
      </li>
      <li>
        <Checkbox
          {...args}
          id="disabledChecked"
          isChecked
          isDisabled
          label="checkbox"
        />
      </li>
    </ul>
  </>
);

export const primary = Template.bind({});
primary.args = {
  color: 'primary',
};

export const gray = Template.bind({});
gray.args = {
  color: 'gray',
};

export const white = Template.bind({});
white.args = {
  color: 'white',
};
white.decorators = [
  (Story) => (
    <body style={{ background: '#333', color: '#fff' }}>
      <Story />
    </body>
  ),
];

import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from '../components/atoms/Button';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => (
  <>
    <p>variants</p>
    <ul>
      <li>
        <Button {...args} variant="contained" onClick={action('clicked')} />
      </li>
      <li>
        <Button {...args} variant="outlined" onClick={action('clicked')} />
      </li>
      <li>
        <Button {...args} variant="text" onClick={action('clicked')} />
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
        <Button
          {...args}
          variant="contained"
          isFullWidth
          onClick={action('clicked')}
        />
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
export const Gray = Template.bind({});
Gray.args = {
  color: 'gray',
  children: 'ボタン',
};
export const GrayIconText = Template.bind({});
GrayIconText.args = {
  color: 'gray',
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

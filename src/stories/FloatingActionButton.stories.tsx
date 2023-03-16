import {
  faPlus,
  faUserPlus,
  faCommentMedical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Fab from '@/components/atoms/FloatingActionButton';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Atoms/FloatingActionButton',
  component: Fab,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: {
      options: ['primary', 'gray', 'white', 'danger'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['circular', 'extended'],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Fab>;

const plusIcon = <FontAwesomeIcon icon={faPlus} />;
const userPlusIcon = <FontAwesomeIcon icon={faUserPlus} />;
const commentPlusIcon = <FontAwesomeIcon icon={faCommentMedical} />;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Fab> = (args) => (
  <>
    <p>variant</p>
    <ul>
      <li>
        <Fab {...args} variant="circular">
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular" isDisabled>
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="extended">
          EXTENDED
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="extended" isDisabled>
          EXTENDED
        </Fab>
      </li>
    </ul>
    <p>size</p>
    <ul>
      <li>
        <Fab {...args} variant="circular" size="small">
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular">
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular" size="large">
          {plusIcon}
        </Fab>
      </li>
    </ul>
    <p>icons</p>
    <ul>
      <li>
        <Fab {...args} variant="circular">
          {userPlusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular">
          {commentPlusIcon}
        </Fab>
      </li>
    </ul>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
};

export const Gray = Template.bind({});
Gray.args = {
  color: 'gray',
};

export const White = Template.bind({});
White.args = {
  color: 'white',
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
};

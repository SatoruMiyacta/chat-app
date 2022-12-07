import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Fab from '../components/atoms/FloatingActionButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faCommentMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default {
  title: 'components/FloatingActionButton',
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
  },
} as ComponentMeta<typeof Fab>;

const plusIcon = <FontAwesomeIcon icon={faPlus} />;
const userPlusIcon = <FontAwesomeIcon icon={faUserPlus} />;
const commentPlusIcon = <FontAwesomeIcon icon={faCommentMedical} />;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Fab> = (args) => (
  <>
    <ul>
      <p>variant</p>
      <li>
        <Fab {...args} variant="circular" onClick={action('clicked')}>
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab
          {...args}
          variant="circular"
          isDisabled
          onClick={action('clicked')}
        >
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="extended" onClick={action('clicked')}>
          EXTENDED
        </Fab>
      </li>
      <li>
        <Fab
          {...args}
          variant="extended"
          isDisabled
          onClick={action('clicked')}
        >
          EXTENDED
        </Fab>
      </li>
    </ul>
    <ul>
      <p>size</p>
      <li>
        <Fab
          {...args}
          variant="circular"
          size="small"
          onClick={action('clicked')}
        >
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular" onClick={action('clicked')}>
          {plusIcon}
        </Fab>
      </li>
      <li>
        <Fab
          {...args}
          variant="circular"
          size="large"
          onClick={action('clicked')}
        >
          {plusIcon}
        </Fab>
      </li>
    </ul>
    <ul>
      <p>icons</p>
      <li>
        <Fab {...args} variant="circular" onClick={action('clicked')}>
          {userPlusIcon}
        </Fab>
      </li>
      <li>
        <Fab {...args} variant="circular" onClick={action('clicked')}>
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

export const danger = Template.bind({});
danger.args = {
  color: 'danger',
};

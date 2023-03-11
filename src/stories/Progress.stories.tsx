import Progress from '@/components/atoms/Progress';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'components/Progress',
  component: Progress,
} as ComponentMeta<typeof Progress>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Progress> = (args) => (
  <>
    <p>size</p>
    <ul>
      <li>
        <Progress {...args} />
      </li>
      <li>
        <Progress {...args} size={48} />
      </li>
      <li>
        <Progress {...args} size={56} />
      </li>
    </ul>
    <p>thickness</p>
    <ul>
      <li>
        <Progress {...args} />
      </li>
      <li>
        <Progress {...args} thickness={6} />
      </li>
      <li>
        <Progress {...args} thickness={8} />
      </li>
    </ul>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  color: 'primary',
};
export const Inherit = Template.bind({});
Inherit.args = {
  color: 'inherit',
};
Inherit.decorators = [
  (Story) => (
    <body style={{ background: '#333', color: '#fff' }}>
      <Story />
    </body>
  ),
];

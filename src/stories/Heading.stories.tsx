import Heading from '@/components/atoms/Heading';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'components/Heading',
  component: Heading,
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => (
  <>
    <p>all</p>
    <ul className="typography">
      <Heading {...args} tag="h1" size="xxl">
        Heading
      </Heading>
      <Heading {...args} tag="h2" size="xl">
        Heading
      </Heading>
      <Heading {...args} tag="h3" size="l">
        Heading
      </Heading>
      <Heading {...args} tag="h4" size="m">
        Heading
      </Heading>
      <Heading {...args} tag="h5" size="s">
        Heading
      </Heading>
      <Heading {...args} tag="h6" size="xs">
        Heading
      </Heading>
      <Heading {...args} tag="h6" size="xxs">
        Heading
      </Heading>
    </ul>
    <p>bold</p>
    <ul className="typography">
      <Heading {...args} tag="h1" size="xxl" isBold>
        Bold
      </Heading>
    </ul>
  </>
);

export const Black = Template.bind({});
Black.args = {
  color: 'black',
};

export const gray = Template.bind({});
gray.args = {
  color: 'gray',
};

export const Inherit = Template.bind({});
Inherit.args = {
  color: 'inherit',
};

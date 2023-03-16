import Skeleton from '@/components/atoms/Skeleton';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Atoms/Skeleton',
  component: Skeleton,
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = (args) => (
  <>
    <p>variants</p>
    <div>
      <Skeleton {...args} variant="rounded" height={16} width={160} />
    </div>
    <div>
      <Skeleton {...args} variant="circular" height={40} width={40} />
    </div>
    <div>
      <Skeleton {...args} variant="rounded" height={48} width={160} />
    </div>
    <div>
      <Skeleton {...args} variant="rectangular" height={64} width={160} />
    </div>
  </>
);

export const defaultSkeleton = Template.bind({});
defaultSkeleton.args = {};

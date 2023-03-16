import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tabs from '@/components/atoms/Tabs';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Atoms/Tabs',
  component: Tabs,
  onClick: { action: 'clicked' },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => (
  <>
    <div style={{ width: '250px' }}>
      <p>Border</p>
      <ul>
        <Tabs {...args} isBorder activeIndex={1} />
      </ul>
      <p>No border</p>
      <ul>
        <Tabs {...args} activeIndex={1} />
      </ul>
      <p>disabled</p>
      <ul>
        <Tabs
          {...args}
          items={[
            {
              label: 'ITEM',
              icon: <FontAwesomeIcon icon={faUser} />,
              isDisabled: true,
            },
          ]}
          isBorder
        />
      </ul>
      <p>icon position</p>
      <ul>
        <div className="flex">
          <Tabs
            {...args}
            items={[
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
            ]}
            iconPosition="top"
            activeIndex={0}
            isBorder
          />
          <Tabs
            {...args}
            items={[
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
            ]}
            iconPosition="start"
            isBorder
          />
          <Tabs
            {...args}
            items={[
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
            ]}
            iconPosition="end"
            isBorder
          />
          <Tabs
            {...args}
            items={[
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
            ]}
            iconPosition="bottom"
            isBorder
          />
        </div>
      </ul>
      <p>scrollable</p>
      <ul>
        <div className="flex">
          <Tabs
            {...args}
            items={[
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
              {
                label: 'ITEM',
                icon: <FontAwesomeIcon icon={faUser} />,
                isDisabled: false,
              },
            ]}
            activeIndex={0}
            isBorder
          />
        </div>
      </ul>
    </div>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      label: 'ITEM',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
    {
      label: 'ITEM',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
  ],
};
export const Black = Template.bind({});
Black.args = {
  color: 'black',
  items: [
    {
      label: 'ITEM',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
    {
      label: 'ITEM',
      icon: <FontAwesomeIcon icon={faUser} />,
      isDisabled: false,
    },
  ],
};

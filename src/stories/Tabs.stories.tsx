import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Tabs from '../components/atoms/Tabs';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default {
  title: 'components/Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => (
  <>
    <div style={{ width: '250px' }}>
      <p>Border</p>
      <ul>
        <Tabs {...args} isBorder activeIndex={1} onClick={action('clicked')} />
      </ul>
      <p>No border</p>
      <ul>
        <Tabs {...args} activeIndex={1} onClick={action('clicked')} />
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
          onClick={action('clicked')}
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
            onClick={action('clicked')}
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
            onClick={action('clicked')}
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
            onClick={action('clicked')}
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
            onClick={action('clicked')}
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
            onClick={action('clicked')}
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

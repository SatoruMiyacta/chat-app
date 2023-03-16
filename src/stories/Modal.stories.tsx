import Modal from '@/components/molecules/Modal';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Molecules/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
  <div>
    <Modal {...args}>
      <p>Cards contain content and actions about a single subject.</p>
    </Modal>
  </div>
);

export const TitleStart = Template.bind({});
TitleStart.args = {
  title: 'Card',
  titleAlign: 'start',
  hasInner: true,
  isOpen: true,
  isBoldTitle: false,
  showCloseButton: false,
};

export const TitleCenter = Template.bind({});
TitleCenter.args = {
  title: 'Card',
  titleAlign: 'center',
  hasInner: true,
  isOpen: true,
  isBoldTitle: false,
  showCloseButton: false,
};
export const TitleEnd = Template.bind({});
TitleEnd.args = {
  title: 'Card',
  titleAlign: 'end',
  hasInner: true,
  isOpen: true,
  isBoldTitle: false,
  showCloseButton: false,
};
export const CloseButton = Template.bind({});
CloseButton.args = {
  title: 'Card',
  titleAlign: 'center',
  hasInner: true,
  isOpen: true,
  isBoldTitle: false,
  showCloseButton: true,
};
export const BoledTitle = Template.bind({});
BoledTitle.args = {
  title: 'Card',
  titleAlign: 'center',
  hasInner: true,
  isOpen: true,
  isBoldTitle: true,
  showCloseButton: false,
};

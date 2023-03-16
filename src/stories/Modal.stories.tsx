import {
  faEllipsisVertical,
  faBan,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '@/components/molecules/Modal';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Molecules/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
  <div>
    <Modal {...args} title="Card" hasInner>
      <p>Cards contain content and actions about a single subject.</p>
    </Modal>
  </div>
);

export const Start = Template.bind({});
Start.args = {
  titleAlign: 'start',
  isOpen: true,
};

export const Center = Template.bind({});
Center.args = {
  titleAlign: 'center',
  isOpen: true,
};
export const End = Template.bind({});
End.args = {
  titleAlign: 'end',
  isOpen: true,
};
export const closeButton = Template.bind({});
closeButton.args = {
  titleAlign: 'center',
  showCloseButton: true,
  isOpen: true,
};
export const BoledTitle = Template.bind({});
BoledTitle.args = {
  titleAlign: 'center',
  isOpen: true,
  isBoldTitle: true,
};

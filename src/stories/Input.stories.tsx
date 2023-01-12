import {
  faMagnifyingGlass,
  faEnvelope,
  faLock,
  faCircleUser,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '@/components/atoms/Input';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'components/Input',
  component: Input,
  argTypes: {
    color: { options: ['primary', 'black'], control: { type: 'radio' } },
    variant: {
      options: ['standard', 'outlined', 'filled'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Input>;

const emailIcon = <FontAwesomeIcon icon={faEnvelope} />;
const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;
const profileIcon = <FontAwesomeIcon icon={faCircleUser} />;
const homeIcon = <FontAwesomeIcon icon={faHouse} />;

const Template: ComponentStory<typeof Input> = (args) => (
  <>
    <p>default</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          placeholder="text"
          id="outlined"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="standard"
          placeholder="text"
          id="standard"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="filled"
          placeholder="text"
          id="filled"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>label</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          label="text"
          id="outlinedLabel"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="standard"
          label="text"
          id="standardLabel"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="filled"
          label="text"
          id="filledLabel"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>email</p>
    <ul>
      <li>
        <Input
          {...args}
          type="email"
          variant="outlined"
          startIcon={emailIcon}
          placeholder="メールアドレス"
          id="outlinedEmail"
          errorMessage=""
          value=""
        />
      </li>
    </ul>

    <p>wide</p>
    <ul>
      <li className="wide">
        <Input
          {...args}
          type="text"
          variant="outlined"
          isFullWidth
          id="outlinedWide"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>small</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          size="small"
          id="outlinedSmall"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>startIcon</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="filled"
          startIcon={searchIcon}
          placeholder="search"
          id="filledSearch"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="filled"
          startIcon={profileIcon}
          placeholder="profile"
          id="filledProfile"
          errorMessage=""
          value=""
        />
      </li>
      <li>
        <Input
          {...args}
          type="text"
          variant="filled"
          startIcon={homeIcon}
          placeholder="home"
          id="filledHome"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>rounded</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          isRounded
          id="outlinedRounded"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <p>multiLine</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          isMultiLines
          id="outlinedMultiLine"
          errorMessage=""
          value=""
          rows={5}
        />
      </li>
    </ul>
    <p>error</p>
    <ul>
      <li>
        <Input
          {...args}
          type="text"
          variant="outlined"
          id="outlinedError"
          errorMessage="正しく入力してください"
          value=""
          isRequired
        />
      </li>
    </ul>
    <p>number</p>
    <ul>
      <li>
        <Input
          {...args}
          type="number"
          variant="outlined"
          id="number"
          errorMessage=""
          value={0}
        />
      </li>
    </ul>
  </>
);

export const primary = Template.bind({});
primary.args = {
  color: 'primary',
};
export const black = Template.bind({});
black.args = {
  color: 'black',
};

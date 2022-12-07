import { ComponentStory, ComponentMeta } from '@storybook/react';
import Input from '../components/atoms/Input';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
const passwordIcon = <FontAwesomeIcon icon={faLock} />;
const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;
const profileIcon = <FontAwesomeIcon icon={faCircleUser} />;
const homeIcon = <FontAwesomeIcon icon={faHouse} />;

const Template: ComponentStory<typeof Input> = (args) => (
  <>
    <ul>
      <p>default</p>
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
    <ul>
      <p>label</p>
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
    <ul>
      <p>email</p>
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
    <ul>
      <p>password</p>
      <li>
        <Input
          {...args}
          type="password"
          variant="standard"
          startIcon={passwordIcon}
          label="パスワード（半角英数字6文字以上）"
          id="outlinedPasswordLabel"
          errorMessage=""
          value=""
        />
      </li>
    </ul>
    <ul>
      <p>wide</p>
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
    <ul>
      <p>small</p>
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
    <ul>
      <p>startIcon</p>
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
    <ul>
      <p>rounded</p>
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
    <ul>
      <p>multiLine</p>
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
    <ul>
      <p>error</p>
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
    <ul>
      <p>number</p>
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

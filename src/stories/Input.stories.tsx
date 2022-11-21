import { isMobileCordova } from '@firebase/util';
import { action } from '@storybook/addon-actions';
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
          label="メールアドレス"
          id="outlinedEmailLabel"
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
          variant="standard"
          startIcon={emailIcon}
          placeholder="メールアドレス"
          id="standardEmail"
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
          variant="standard"
          startIcon={emailIcon}
          label="メールアドレス"
          id="standardEmailLabel"
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
          variant="filled"
          startIcon={emailIcon}
          placeholder="メールアドレス"
          id="filledEmail"
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
          variant="filled"
          startIcon={emailIcon}
          label="メールアドレス"
          id="filledEmailLabel"
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
          variant="outlined"
          startIcon={passwordIcon}
          label="パスワード（半角英数字6文字以上）"
          id="outlinedPasswordLabel"
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
          size
          id="outlinedSmall"
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
          value=""
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

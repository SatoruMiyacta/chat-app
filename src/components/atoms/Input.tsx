import { faRoad } from '@fortawesome/free-solid-svg-icons';
import styles from './Input.module.css';

interface InputType {
  color: 'primary' | 'black';
  variant: 'outlined' | 'standard' | 'filled';
  size?: boolean;
  startIcon?: React.ReactNode;
  isFullWidth?: boolean;
  isRounded?: boolean;
  isMultiLines?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  id: string;
  maxLength?: number;
  minLength?: number;
  maxValue?: number;
  minValue?: number;
  errorMessage?: string;
  isRequired?: boolean;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

interface InputString extends InputType {
  type: 'text' | 'email' | 'password';
  value: string;
}

interface InputNumber extends InputType {
  type: 'number';
  value: number;
}

type InputProps = InputString | InputNumber;

const Input = ({
  type,
  color,
  variant,
  size = false,
  startIcon,
  isFullWidth = false,
  isRounded = false,
  isMultiLines = false,
  label,
  placeholder = ' ',
  value,
  id,
  maxLength,
  minLength,
  maxValue,
  minValue,
  errorMessage,
  isRequired = false,
  onChange,
}: InputProps) => {
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange(event);
  };

  // validation

  let _errorMessage = '';
  const emailRegex = new RegExp(
    '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$'
  );

  // 文字数の最小と最大
  if (typeof value !== 'number') {
    if (typeof minLength !== 'undefined' && [...value].length < minLength) {
      _errorMessage = `文字数を${minLength}文字以上にしてください`;
    }

    if (typeof maxLength !== 'undefined' && [...value].length > maxLength) {
      _errorMessage = `文字数を${maxLength}文字以下にしてください`;
    }
  }

  // メールアドレスが正しく入力されているか
  if (type === 'email' && !emailRegex.test(value)) {
    _errorMessage = `メールアドレスを正しく入力してください`;
  }

  // 数字の最小値、最大値
  if (typeof value === 'number') {
    if (typeof minValue !== 'undefined' && value < minValue) {
      _errorMessage = `値を${minValue}以上にしてください`;
    }

    if (typeof maxValue !== 'undefined' && value < maxValue) {
      _errorMessage = `値を${maxValue}以下にしてください`;
    }
  }

  // required
  if (value === '' && isRequired) {
    _errorMessage = `必須入力項目です`;
  }

  // textfieldのclassNameリスト
  const textfiledList = [styles.textfiled, styles[color], styles[variant]];

  if (_errorMessage || !isRequired) {
    textfiledList.push(styles.errorMessage);
  }

  // inputのclassNameリスト
  const inputList = [styles.input, styles[color], styles[variant]];

  if (size) {
    inputList.push(styles.small);
  }
  if (isFullWidth) {
    inputList.push(styles.fullWidth);
  }
  if (isRounded) {
    inputList.push(styles.rounded);
  }
  if (isMultiLines) {
    inputList.push(styles.multiLines);
  }

  // iconのclassNameリスト
  const iconList = [];

  if (startIcon) {
    iconList.push(styles.icon);
  } else {
    inputList.push(styles.iconNone);
  }

  // labelのclassNameリスト
  const labelList = [styles.label];

  if (startIcon) {
    labelList.push(styles.icon);
  } else {
    labelList.push(styles.iconNone);
  }

  if (typeof errorMessage !== 'undefined') {
    _errorMessage = errorMessage;
  }

  if (isMultiLines) {
    return (
      <div className={textfiledList.join(' ')}>
        <span className={iconList.join(' ')}>{startIcon}</span>
        <label htmlFor={id} className={styles.inputLabel}>
          <textarea
            id={id}
            className={inputList.join(' ')}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
          />
          <span className={labelList.join(' ')}>{label}</span>
        </label>
        {_errorMessage && (
          <span className={styles.errorMessage}>{_errorMessage}</span>
        )}
      </div>
    );
  }

  return (
    <div className={textfiledList.join(' ')}>
      <span className={iconList.join(' ')}>{startIcon}</span>
      <label htmlFor={id} className={styles.inputLabel}>
        <input
          type={type}
          id={id}
          className={inputList.join(' ')}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          value={value}
        />
        <span className={labelList.join(' ')}>{label}</span>
      </label>
      {_errorMessage && (
        <span className={styles.errorMessage}>{_errorMessage}</span>
      )}
    </div>
  );
};
export default Input;

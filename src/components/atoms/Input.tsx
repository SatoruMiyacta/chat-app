import styles from './Input.module.css';
import { useState } from 'react';

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
  onBlur?: (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
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
  onBlur,
}: // onFocus,
InputProps) => {
  const [error, setError] = useState('');
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (error) {
      const errorMessage = validate();
      if (errorMessage === '') {
        setError('');
      }
    }
    onChange(event);
  };

  const handleBlur = (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    const errorMessage = validate();
    setError(errorMessage);
    if (onBlur) {
      onBlur(event);
    }
  };

  // validation

  const validate = () => {
    const emailRegex = new RegExp(
      '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$'
    );

    // 文字数の最小と最大
    if (typeof value !== 'number') {
      if (typeof minLength !== 'undefined' && [...value].length < minLength) {
        return `文字数を${minLength}文字以上にしてください`;
      }

      if (typeof maxLength !== 'undefined' && [...value].length > maxLength) {
        return `文字数を${maxLength}文字以下にしてください`;
      }
    }

    // メールアドレスが正しく入力されているか
    if (type === 'email' && !emailRegex.test(value)) {
      return `メールアドレスを正しく入力してください`;
    }

    // 数字の最小値、最大値
    if (typeof value === 'number') {
      if (typeof minValue !== 'undefined' && value < minValue) {
        return `値を${minValue}以上にしてください`;
      }

      if (typeof maxValue !== 'undefined' && value < maxValue) {
        return `値を${maxValue}以下にしてください`;
      }
    }

    // required
    if (value === '' && isRequired) {
      return `必須入力項目です`;
    }

    if (typeof errorMessage !== 'undefined') {
      return errorMessage;
    }

    return '';
  };

  // textfieldのclassNameリスト
  const textfieldClassList = [styles.textfiled, styles[color], styles[variant]];

  if (error || isRequired) {
    textfieldClassList.push(styles.errorMessage);
  }

  // inputのclassNameリスト
  const inputClassList = [styles.input, styles[color], styles[variant]];

  if (size) {
    inputClassList.push(styles.small);
  }
  if (isFullWidth) {
    inputClassList.push(styles.fullWidth);
  }
  if (isRounded) {
    inputClassList.push(styles.rounded);
  }
  if (isMultiLines) {
    inputClassList.push(styles.multiLines);
  }

  // iconのclassNameリスト
  const iconClassList = [];

  if (startIcon) {
    iconClassList.push(styles.icon);
  } else {
    inputClassList.push(styles.iconNone);
  }

  // labelのclassNameリスト
  const labelList = [styles.label];

  if (startIcon) {
    labelList.push(styles.icon);
  } else {
    labelList.push(styles.iconNone);
  }

  if (isMultiLines) {
    return (
      <div className={textfieldClassList.join(' ')}>
        <span className={iconClassList.join(' ')}>{startIcon}</span>
        <label htmlFor={id} className={styles.inputLabel}>
          <textarea
            id={id}
            className={inputClassList.join(' ')}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
            onBlur={handleBlur}
          />
          <span className={labelList.join(' ')}>{label}</span>
        </label>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  return (
    <div>
      <div className={textfieldClassList.join(' ')}>
        <span className={iconClassList.join(' ')}>{startIcon}</span>
        <label htmlFor={id} className={styles.inputLabel}>
          <input
            type={type}
            id={id}
            className={inputClassList.join(' ')}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
            onBlur={handleBlur}
          />
          <span className={labelList.join(' ')}>{label}</span>
        </label>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
export default Input;

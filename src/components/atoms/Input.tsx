import { useState, useEffect, useRef } from 'react';

import styles from './Input.module.css';

interface InputType {
  color: 'primary' | 'black';
  variant: 'outlined' | 'standard' | 'filled';
  id: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  size?: 'small' | 'medium';
  startIcon?: React.ReactNode;
  isFullWidth?: boolean;
  isRounded?: boolean;
  isMultiLines?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  maxValue?: number;
  minValue?: number;
  errorMessage?: string;
  isRequired?: boolean;
  onBlur?: (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => void;
  onFocus?: (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => void;
  onKeyDown?: (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  rows?: number;
  minRows?: number;
  maxRows?: number;
}

interface InputString extends InputType {
  type: 'text' | 'email' | 'password';
  value: string;
}

interface InputNumber extends InputType {
  type: 'number';
  value: number;
}

export type InputProps = InputString | InputNumber;

const Input = (props: InputProps) => {
  const {
    type,
    color,
    variant,
    id,
    onChange,
    size = 'medium',
    startIcon,
    isFullWidth = false,
    isRounded = false,
    isMultiLines = false,
    label,
    placeholder = ' ',
    value,
    maxLength,
    minLength,
    maxValue,
    minValue,
    isRequired = false,
    onBlur,
    onFocus,
    onKeyDown,
    rows,
    minRows,
    maxRows,
  } = props;
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * placeholderの初期値を返す
   */
  const getInitialPlaceholder = () => {
    // labelとplaceholderが両方propsに渡されたとき重なってしまうため、
    // labelがないときにplaceholderを表示させる
    if (!label) return placeholder;

    // labelがあるときはplaceholderと重ならないように' 'を返して、labelを表示させる
    if (placeholder) {
      return ' ';
    }
  };
  const [displayPlaceholder, setDisplayPlaceholder] = useState(
    getInitialPlaceholder()
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (errorMessage) {
      const result = validate();
      setErrorMessage(result);
    }
    onChange(event);
  };

  const handleBlur = (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    const result = validate();
    setErrorMessage(result);
    if (onBlur) {
      onBlur(event);
      if (value === '' && isRequired) {
        setDisplayPlaceholder(getInitialPlaceholder());
      }
    }
  };

  const handleFocus = (
    event:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    if (placeholder) {
      setDisplayPlaceholder(placeholder);
    }
    if (value === '' && isRequired) {
      setErrorMessage('');
    }
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleKeyDown = (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      onKeyDown &&
      event.key === 'Enter' &&
      (event.ctrlKey || event.metaKey)
    ) {
      onKeyDown(event);
    }
  };

  useEffect(() => {
    if (typeof value === 'number') return;

    if ([...value].length === minLength) setErrorMessage('');
  }, [value]);

  // validation
  const validate = () => {
    const emailRegex = new RegExp(
      '^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$'
    );

    // required
    if (value === '' && isRequired) {
      return `必須入力項目です`;
    }

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
    return '';
  };

  // textareaの高さを可変にする
  const defaultTextareaHeight = {
    small: 32,
    medium: 48,
  };
  useEffect(() => {
    const textareaStyleRef = textareaRef.current?.style;
    if (!textareaStyleRef) {
      return;
    }
    let textareaHeight = `${defaultTextareaHeight[size]}px`;
    textareaStyleRef.height = textareaHeight;
    if (rows) {
      textareaHeight = `${defaultTextareaHeight[size] + (rows - 1) * 16}px`;
    } else {
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaHeight = `${scrollHeight}px`;
    }
    if (maxRows) {
      const maxHeight = `${defaultTextareaHeight[size] + maxRows * 16}px`;
      textareaStyleRef.maxHeight = maxHeight;
    }

    if (minRows) {
      const minHeight = `${defaultTextareaHeight[size] + minRows * 16}px`;
      textareaStyleRef.minHeight = minHeight;
    }

    textareaStyleRef.height = textareaHeight;
  }, [value]);

  const displayErrorMessage = props.errorMessage || errorMessage;

  // textfieldのclassNameリスト
  const textfieldClassList = [
    styles.textfiled,
    styles[color],
    styles[variant],
    styles[size],
  ];
  if (displayErrorMessage) {
    textfieldClassList.push(styles.isError);
  }

  // inputのclassNameリスト
  const inputClassList = [
    styles.input,
    styles[color],
    styles[variant],
    styles[size],
  ];

  if (isFullWidth) {
    inputClassList.push(styles.fullWidth);
  }
  if (isRounded) {
    inputClassList.push(styles.rounded);
  }
  if (isMultiLines) {
    inputClassList.push(styles.multiLines);
    inputClassList.push(styles.textarea);
  }

  // iconのclassNameリスト
  const iconClassList = [];
  if (startIcon) {
    iconClassList.push(styles.icon);
  } else {
    inputClassList.push(styles.iconNone);
  }

  // labelのclassNameリスト
  const labelClassList = [styles.label];
  if (startIcon) {
    labelClassList.push(styles.icon);
  } else {
    labelClassList.push(styles.iconNone);
  }

  if (isMultiLines) {
    return (
      <div>
        <div className={textfieldClassList.join(' ')}>
          <span className={iconClassList.join(' ')}>{startIcon}</span>
          <label htmlFor={id} className={styles.inputLabel}>
            <textarea
              ref={textareaRef}
              id={id}
              className={inputClassList.join(' ')}
              placeholder={displayPlaceholder}
              maxLength={maxLength}
              minLength={minLength}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              rows={rows}
            />
            {label && <span className={labelClassList.join(' ')}>{label}</span>}
          </label>
        </div>
        {displayErrorMessage && (
          <span className={styles.errorMessage}>{displayErrorMessage}</span>
        )}
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
            placeholder={displayPlaceholder}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
          {label && <span className={labelClassList.join(' ')}>{label}</span>}
        </label>
      </div>
      {displayErrorMessage && (
        <span className={styles.errorMessage}>{displayErrorMessage}</span>
      )}
    </div>
  );
};
export default Input;

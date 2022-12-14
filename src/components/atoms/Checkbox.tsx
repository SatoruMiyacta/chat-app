import styles from './Checkbox.module.css';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface CheckboxProps {
  color: 'primary' | 'gray' | 'white';
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => void;
  isDisabled?: boolean;
  size?: 'small' | 'medium';
  label?: string;
  id?: string;
  isChecked?: boolean;
  vertical?: boolean;
  items?: {
    id: string;
    isChecked: boolean;
    label?: string;
    isDisabled?: boolean;
  }[];
}

const Checkbox = ({
  color,
  id,
  onChange,
  isChecked = false,
  isDisabled = false,
  size = 'medium',
  label,
  vertical = false,
  items,
}: CheckboxProps) => {
  const containerStyles: React.CSSProperties = { flexDirection: 'row' };
  if (vertical) containerStyles.flexDirection = 'column';

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    if (isDisabled) return;
    onChange(event, index);
  };

  const getCheckboxLabelClass = (index?: number) => {
    const labelTagClass = [styles.checkboxWrapper];
    if (index !== undefined && items?.[index].isDisabled) {
      labelTagClass.push(styles.disabled);
    }

    if (isDisabled) labelTagClass.push('disabled');

    return labelTagClass.join(' ');
  };

  const inputCheckboxClass = [styles.checkboxCircle, styles[color]];
  if (size) {
    inputCheckboxClass.push(styles[size]);
  }

  const checkedIcon = <FontAwesomeIcon icon={faCheck} />;

  if (items) {
    return (
      <div style={containerStyles} className={styles.container}>
        {items.map((item, index) => (
          <label key={item.id} className={getCheckboxLabelClass(index)}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                className={inputCheckboxClass.join(' ')}
                id={item.id}
                checked={item.isChecked}
                disabled={item.isDisabled}
                onChange={(event) => handleChange(event, index)}
              />
              <span className={styles.checkedIcon}>{checkedIcon}</span>
            </div>
            {item.label && (
              <span className={styles.checkboxLabel}>{item.label}</span>
            )}
          </label>
        ))}
      </div>
    );
  }
  return (
    <label className={getCheckboxLabelClass()}>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          className={inputCheckboxClass.join(' ')}
          id={id}
          checked={isChecked}
          disabled={isDisabled}
          onChange={(event) => handleChange(event)}
        />
        <span className={styles.checkedIcon}>{checkedIcon}</span>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
export default Checkbox;

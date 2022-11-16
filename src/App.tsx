import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Input from './components/atoms/Input';
import Button from './components/atoms/Button';

library.add(fas, far, fab);

function App() {
  const [value, setValue] = useState('');

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  const post = () => {
    if (value === '') {
      return;
    }
  };

  return (
    <div className="App">
      <Input
        type="text"
        color="primary"
        variant="outlined"
        placeholder="text"
        id="outlined"
        value={value}
        onChange={handleChange}
        isRequired
      />
      <Button color="primary" variant="contained" onClick={post}>
        ボタン
      </Button>
    </div>
  );
}

export default App;

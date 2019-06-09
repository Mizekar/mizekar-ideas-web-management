import React from 'react';
import ReactDOM from 'react-dom';
import Verify from './Verify';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Verify />, div);
  ReactDOM.unmountComponentAtNode(div);
});

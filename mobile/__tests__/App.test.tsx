import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../src/App';

test('renders welcome text', () => {
  const {getByText} = render(<App />);
  expect(getByText(/Welcome to Mobile App/i)).toBeTruthy();
});

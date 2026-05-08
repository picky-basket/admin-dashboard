import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders dashboard UI', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders dashboard UI', async () => {
  render(<App />);
  expect(await screen.findByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

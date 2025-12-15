import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe board and allows a move', () => {
  render(<App />);

  // Status indicator exists
  expect(
    screen.getByText((content) => /Turn: X|Winner|Draw!/i.test(content))
  ).toBeInTheDocument();

  // There should be 9 cells
  const cells = screen.getAllByRole('gridcell');
  expect(cells.length).toBe(9);

  // Click first cell and expect an 'X'
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveTextContent('X');
});

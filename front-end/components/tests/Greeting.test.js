// front-end/components/Greeting.test.js
import { render, screen } from '@testing-library/react';
// import Greeting from './Greeting.tsx';
import Greeting from '../Greeting'; // Adjust the import path as necessary

describe('Greeting', () => {
  it('renders the name passed as prop', () => {
    render(<Greeting name="Kok Yee" />);
    expect(screen.getByText('Hello, Kok Yee!')).toBeInTheDocument();
  });
});
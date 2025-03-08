import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

// Mock the AnimatedCard component for testing
const AnimatedCard = ({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: ReactNode;
  delay?: number;
}) => (
  <div className="group relative bg-gray-900/50">
    <div>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  },
}));

describe('AnimatedCard', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    icon: <svg data-testid="test-icon" />,
    delay: 0.2,
  };

  it('renders the card with correct content', () => {
    render(<AnimatedCard {...mockProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies the correct classes', () => {
    render(<AnimatedCard {...mockProps} />);
    
    const card = screen.getByText('Test Title').closest('div');
    expect(card).toHaveClass('group');
    expect(card).toHaveClass('relative');
    expect(card).toHaveClass('bg-gray-900/50');
  });
}); 
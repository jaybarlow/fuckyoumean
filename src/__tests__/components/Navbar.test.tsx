import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Navbar', () => {
  it('renders the logo and navigation links', () => {
    render(<Navbar />);
    
    // Check for logo
    expect(screen.getByText('Shadow')).toBeInTheDocument();
    expect(screen.getByText('Site')).toBeInTheDocument();
    
    // Check for navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
  
  it('has correct link destinations', () => {
    render(<Navbar />);
    
    // Check href attributes
    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About').closest('a');
    const servicesLink = screen.getByText('Services').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(servicesLink).toHaveAttribute('href', '/services');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
}); 
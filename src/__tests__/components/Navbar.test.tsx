import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  AuthContext: {
    Provider: ({ children, value }: { children: React.ReactNode; value: any }) => children,
  },
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders the logo and navigation links', () => {
    render(<Navbar />);
    
    // Check for logo
    expect(screen.getByText('Shadow')).toBeInTheDocument();
    expect(screen.getByText('Site')).toBeInTheDocument();
    
    // Check for navigation links in desktop menu
    const desktopMenu = document.querySelector('.hidden.md\\:block');
    if (desktopMenu) {
      expect(desktopMenu.textContent).toContain('Home');
      expect(desktopMenu.textContent).toContain('About');
      expect(desktopMenu.textContent).toContain('Services');
      expect(desktopMenu.textContent).toContain('Contact');
    } else {
      throw new Error('Desktop menu not found');
    }
  });
  
  it('has correct link destinations', () => {
    render(<Navbar />);
    
    // Get desktop menu links
    const desktopMenu = document.querySelector('.hidden.md\\:block');
    if (!desktopMenu) {
      throw new Error('Desktop menu not found');
    }
    
    // Check href attributes for links in desktop menu
    const links = desktopMenu.querySelectorAll('a');
    const homeLink = Array.from(links).find(link => link.textContent === 'Home');
    const aboutLink = Array.from(links).find(link => link.textContent === 'About');
    const servicesLink = Array.from(links).find(link => link.textContent === 'Services');
    const contactLink = Array.from(links).find(link => link.textContent === 'Contact');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(servicesLink).toHaveAttribute('href', '/services');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
}); 
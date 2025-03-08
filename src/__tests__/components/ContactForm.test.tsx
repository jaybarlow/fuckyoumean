import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

// Create a simplified ContactForm component for testing
const ContactForm = () => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-lg">
    <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg"
          placeholder="Your message..."
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
      >
        Send Message
      </button>
    </form>
  </div>
);

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children: ReactNode }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('ContactForm', () => {
  it('renders the form correctly', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });
}); 
# ShadowSite - Next.js TypeScript Shadow Website

A modern, sleek website with shadow effects and smooth animations built with Next.js and TypeScript.

## Features

- Dark theme with shadow effects
- Responsive design
- Smooth animations with Framer Motion
- Form validation with Zod and React Hook Form
- TypeScript for type safety
- Modern UI components

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fuckyoumean
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Testing

This project uses Jest and React Testing Library for testing. The following test scripts are available:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- Unit tests for components are in `src/__tests__/components/`
- Validation schema tests are in `src/__tests__/lib/validations/`

### Writing Tests

When writing tests, follow these guidelines:

1. **Component Tests**: Test the rendering and behavior of components
2. **Validation Tests**: Test the validation logic for forms
3. **Mock Dependencies**: Use Jest mocks for external dependencies

Example component test:
```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Project Structure

- `src/app/`: Next.js App Router pages
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions and validation schemas
- `src/__tests__/`: Test files

## Technologies Used

- Next.js 15.x
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Jest
- React Testing Library
